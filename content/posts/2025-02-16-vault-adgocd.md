---
date: 2025-02-16T23:20:52+05:30
title: 'Stop Hardcoding Secrets! Use HashiCorp Vault & ArgoCD for Secure Deployments'
published: true
tags: ["devops", "openshift", "hashicorp", "vault", "docker", "k8s"]
---
Hardcoding **secrets** like passwords, API keys, and database credentials inside **Docker images** is a big security risk. If these images are shared or stored in a public registry, sensitive data can be exposed. A much better approach is to **store secrets securely** and inject them into applications only when needed.

In a recent project, I worked on **securing secrets** in a Kubernetes-based environment using **HashiCorp Vault** and **ArgoCD Vault Plugin**. This method ensures that sensitive data is never stored inside the application code or Docker images.

### How It Works:

1️⃣ **Store Secrets in HashiCorp Vault**
   - Secrets are securely stored in **HashiCorp Vault**, allowing easy updates and controlled access.
   - This removes the need to keep secrets inside config files or environment variables in the codebase.

2️⃣ **Fetch Secrets Dynamically Using ArgoCD Vault Plugin**
   - During deployment, **ArgoCD Vault Plugin** pulls the latest secrets from **Vault**.
   - This ensures that applications always get the most up-to-date credentials.

3️⃣ **Inject Secrets as OpenShift Secrets**
   - The secrets fetched from **Vault** are stored as **OpenShift Secrets**.
   - Applications can then access them securely without needing to store them in code.

### Example: Kubernetes Secret Managed by ArgoCD Vault Plugin

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sample-secret-group
  annotations:
    avp.kubernetes.io/path: apps/data/<sample-approle>/path/to/secret
type: Opaque
stringData:
  ENV_VAR_NAME: <key_name>
```

### Why This Approach?

✅ **No Secrets in Docker Images** – Eliminates the risk of leaking credentials.
✅ **Automatic Secret Updates** – Apps always use the latest secrets without redeploying.
✅ **Better Security & Compliance** – Ensures secrets are properly managed and controlled.
✅ **Scalability & Flexibility** – Works smoothly across different environments and clusters.

By following this method, we improved security, reduced manual secret management, and made our deployment process **safer and more efficient**.

If you’re working with **HashiCorp Vault, ArgoCD, OpenShift, or Kubernetes security**, I’d love to hear how you’re handling secrets! Let’s connect and share ideas.

#Kubernetes #OpenShift #HashiCorpVault #ArgoCD #DevSecOps #SecretsManagement
