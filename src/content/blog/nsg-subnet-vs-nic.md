---
title: "NSG at Subnet vs NIC Level: What Actually Gets Evaluated"
date: 2026-09-07
description: "How Azure evaluates network security groups when they sit on both the subnet and the NIC, and the checks I run before touching a single rule."
tags: [Azure, Networking, NSG]
draft: false
---

Few things in Azure networking cause as much quiet confusion as a network security group attached in two places. A rule that "clearly allows" the traffic is sitting right there, and the connection still times out. Almost every time, the answer is the evaluation order, not a broken rule.

Here's the mental model I use.

## Two gates, not one

An NSG can be associated with a subnet, a network interface (NIC), or both. When both exist, Azure treats them as two separate gates, and traffic has to get through each one:

- **Inbound:** the subnet NSG is evaluated first, then the NIC NSG.
- **Outbound:** the NIC NSG is evaluated first, then the subnet NSG.

An allow in one NSG does not override a deny in the other. If the subnet NSG allows HTTPS but the NIC NSG has no matching allow, the NIC's default `DenyAllInBound` rule drops it. Both gates have to say yes.

If there's no NSG at one of the levels, that level simply doesn't filter. That's how a VM can look wide open from the subnet's point of view and still be locked down at the NIC.

## Inside a single NSG: priority, then first match

Within one NSG, rules are processed in priority order, from the lowest number (100) to the highest (4096). The first rule that matches wins and processing stops. A broad deny at priority 200 will shadow a precise allow at priority 300, no matter how specific the allow is.

Every NSG also carries default rules at priorities 65000 to 65500. You can't delete them, only override them with higher-priority rules:

| Direction | Default rules |
| --- | --- |
| Inbound | AllowVNetInBound, AllowAzureLoadBalancerInBound, DenyAllInBound |
| Outbound | AllowVnetOutBound, AllowInternetOutBound, DenyAllOutBound |

`AllowVNetInBound` is the one that surprises people. The `VirtualNetwork` service tag covers more than the VNet's own address space: it includes peered VNets and connected on-premises ranges. A lot of "internal" traffic is allowed before any custom rule gets a say.

## Things that trip people up

**Intra-subnet traffic is filtered too.** A subnet NSG applies to traffic between two VMs in the same subnet. Add a deny with a broad source and you can cut off neighbours that never leave the subnet.

**NSGs are stateful.** If a flow is allowed in one direction, the return traffic is allowed automatically. You don't need mirror rules for responses.

**Existing connections can outlive a rule change.** Removing an allow rule doesn't necessarily kill flows that are already established. When you test a new deny, test it with a new connection.

**Health probes need a path.** If you override the default inbound rules, make sure the `AzureLoadBalancer` service tag is still allowed, or the load balancer will mark healthy backends as down.

## How I check what actually applies

Reading two NSGs side by side and merging them in your head is error-prone. Azure will do the merge for you.

**Effective security rules** on the NIC show the combined result of the subnet and NIC NSGs for that interface:

```bash
az network nic list-effective-nsg \
  --resource-group <rg> \
  --name <nic-name>
```

**IP flow verify** in Network Watcher tests one specific flow and tells you which rule allowed or denied it:

```bash
az network watcher test-ip-flow \
  --resource-group <rg> \
  --vm <vm-name> \
  --direction Inbound \
  --protocol TCP \
  --local <vm-private-ip>:443 \
  --remote <source-ip>:50000
```

The output names the exact rule and the NSG it came from. That one line usually ends the debate faster than any amount of clicking through the portal.

## My rule of thumb

Microsoft's own guidance is to associate an NSG with either the subnet or the NIC, not both, unless you have a specific reason. I follow that. Subnet-level NSGs carry the baseline. Application security groups express intent like "web tier can talk to app tier" without hard-coding addresses. NIC-level NSGs are reserved for genuine exceptions, and they get called out in the change request so the next engineer knows the second gate exists.

And when something is blocked, I don't start by editing rules. I check effective rules, run IP flow verify, and only then change the one rule the tooling points at.
