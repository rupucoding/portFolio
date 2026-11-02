---
title: "Debugging Private Endpoint DNS Resolution in Azure"
date: 2026-09-21
description: "Private endpoint deployed, but traffic still goes to the public IP? A step-by-step way to find where name resolution is going wrong."
tags: [Azure, Private Endpoints, DNS]
draft: false
---

A private endpoint is only half the job. The other half is making sure clients resolve the service's name to the private IP. When that half is wrong, the symptoms look like a firewall problem: timeouts, `403` responses from a storage account with public access disabled, or traffic quietly leaving over the internet.

Most private endpoint problems turn out to be DNS. This is the order I check things in.

## How resolution is supposed to work

Take a storage account called `mystorage`. Once you add a private endpoint for its blob service:

1. The public name `mystorage.blob.core.windows.net` returns a CNAME to `mystorage.privatelink.blob.core.windows.net`.
2. A private DNS zone named `privatelink.blob.core.windows.net` holds an A record for `mystorage` that points at the endpoint's private IP.
3. That zone is linked to the virtual network the client resolves from.

Clients keep using the normal public name. Inside the network, the CNAME lands in the private zone and returns the private IP. Outside, the same CNAME resolves through public DNS to the public IP. Nothing in the application has to change.

## Step 1: see what the client actually gets

Always start from the machine that's failing, not from your laptop:

```bash
nslookup mystorage.blob.core.windows.net
```

On Windows, `Resolve-DnsName` gives the same answer in more detail. What to look for:

- **CNAME to `privatelink` and a private IP:** DNS is fine. Look at NSGs, routes or the service's own firewall next.
- **CNAME to `privatelink` but a public IP:** the client's resolver isn't reaching your private zone.
- **No `privatelink` in the chain at all:** check that a private endpoint exists for that exact sub-resource (blob, file, dfs and so on) and that its connection is approved.

## Step 2: check the zone and its records

The zone name has to match exactly: `privatelink.blob.core.windows.net` for blob storage, `privatelink.vaultcore.azure.net` for Key Vault, and so on. A zone named after the wrong sub-resource is easy to create and hard to spot.

Then confirm the A record exists and points at the endpoint's current IP. If an endpoint was deleted and recreated, a manually created record can be stale. Attaching a **DNS zone group** to the private endpoint lets Azure create and clean up the record for you:

```bash
az network private-endpoint dns-zone-group list \
  --resource-group <rg> \
  --endpoint-name <pe-name>
```

## Step 3: check the VNet link

A private DNS zone only answers queries that come from virtual networks linked to it:

```bash
az network private-dns link vnet list \
  --resource-group <rg> \
  --zone-name privatelink.blob.core.windows.net
```

In a hub-and-spoke design, the real question is which VNet's resolver the client uses. If spokes point at custom DNS servers in the hub, the zone must be linked to the hub VNet where those servers live. Linking it only to the spoke does nothing for them.

## Step 4: follow the custom DNS path

If clients use custom DNS servers (domain controllers, a DNS forwarder, or Azure DNS Private Resolver), those servers need to forward Azure service zones to Azure-provided DNS from inside a VNet that's linked to the private zone.

A common mistake is a conditional forwarder for the `privatelink` zone only. Forward the public zone (for example `blob.core.windows.net`) instead, so the whole CNAME chain is followed. On-premises DNS works the same way: forward those zones into Azure, typically to a Private Resolver inbound endpoint.

## Step 5: don't forget caches and proxies

Two things are easy to miss:

- **Caching.** Clients and DNS servers cache the old public answer. Flush the client cache (`ipconfig /flushdns` on Windows) and allow for TTLs on intermediate servers before deciding a fix didn't work.
- **Forward proxies.** If traffic goes through a proxy such as Squid, the proxy does the name resolution, not the client. Test from the proxy host, because that's the resolver that matters.

## The short version

When a private endpoint "doesn't work", resolve the name from the failing client, compare the answer with the expected `privatelink` chain, and walk backwards: record, zone name, VNet link, forwarding, cache. The fix is usually one missing link or one forwarder pointed at the wrong zone.
