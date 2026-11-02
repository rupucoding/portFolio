---
title: "Rotating Application Gateway Certificates with Key Vault"
date: 2026-10-05
description: "Using Key Vault references and versionless secret IDs so Application Gateway picks up renewed TLS certificates without a late-night change window."
tags: [Azure, Application Gateway, Key Vault, TLS]
draft: false
---

Certificate expiry is one of the few outages you can see coming months ahead, and it still catches teams out. With Application Gateway v2, most of the manual work in rotation goes away: keep listener certificates in Key Vault and let the gateway pick up new versions on its own.

Here's how I set it up and what I verify every time.

## The moving parts

- **Key Vault** holds the certificate. Renewals are stored as new versions under the same certificate name.
- **A user-assigned managed identity** is attached to the Application Gateway and allowed to read secrets from that vault.
- **The HTTPS listener** references the certificate by its Key Vault **secret ID**, instead of an uploaded PFX.

Application Gateway reads the certificate through Key Vault's secret interface. That's why the identity needs secret permissions even though what you store is a certificate.

## Versionless vs versioned references

This one detail decides whether rotation is automatic:

```text
https://<vault>.vault.azure.net/secrets/<cert-name>/            # versionless
https://<vault>.vault.azure.net/secrets/<cert-name>/<version>   # pinned
```

With a **versionless** secret ID, Application Gateway polls Key Vault every four hours and moves to the newest version on its own. With a **versioned** ID, the gateway stays on that exact version until someone changes the reference. Pinning has its uses, but if the goal is hands-off rotation, use the versionless form.

## Setting it up

Attach the identity to the gateway and let it read secrets. With access policies:

```bash
az network application-gateway identity assign \
  --gateway-name <agw-name> \
  --resource-group <rg> \
  --identity <identity-resource-id>

az keyvault set-policy \
  --name <vault-name> \
  --object-id <identity-principal-id> \
  --secret-permissions get
```

If the vault uses Azure RBAC instead, assign the **Key Vault Secrets User** role to the identity on the vault.

Then point the listener's certificate at Key Vault:

```bash
az network application-gateway ssl-cert create \
  --gateway-name <agw-name> \
  --resource-group <rg> \
  --name <listener-cert-name> \
  --key-vault-secret-id "https://<vault>.vault.azure.net/secrets/<cert-name>/"
```

## Rotating a certificate

When a renewed certificate arrives from your CA, import it as a new version under the same name:

```bash
az keyvault certificate import \
  --vault-name <vault-name> \
  --name <cert-name> \
  --file renewed-cert.pfx \
  --password <pfx-password>
```

If the certificate comes from a CA that's integrated with Key Vault, Key Vault can renew it automatically, which closes the loop completely.

That's the whole rotation. Within the polling window, the gateway starts serving the new certificate. Because of that window, I import renewals days or weeks before expiry, never on the last afternoon.

## What I verify after every rotation

**1. The certificate actually being served.** Check the dates and issuer from outside, using the hostname the listener serves:

```bash
openssl s_client -connect <hostname>:443 -servername <hostname> </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

**2. The full chain.** The PFX should include the intermediate certificates. A missing intermediate works in some browsers and breaks API clients and older devices.

**3. Key Vault networking.** If the vault's firewall is on, the gateway still needs a path to it: allow trusted Microsoft services, or give the gateway's subnet access through a service endpoint or private endpoint. If the gateway loses access, Azure Advisor reports it and the affected listener can be disabled until access is restored. That's a much worse outage than an expiring certificate.

**4. Backend TLS is separate.** With end-to-end TLS, the backend certificates and the trusted root certificates in the backend settings are their own concern. Rotating the listener certificate doesn't touch them.

## Don't rely on memory

Automatic rotation still needs a renewed certificate to exist. I set up an alert on certificate expiry (Key Vault publishes a near-expiry event through Event Grid) so renewal starts weeks ahead, not the night before. Combined with a versionless reference, rotation stops being an emergency change and becomes a routine import.
