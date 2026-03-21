# n8n-nodes-blocked

Demo community node that demonstrates sandbox permission enforcement.

This node declares `thirdPartyDeps: true` but does **not** declare any
`permissions`. When executed, it attempts an HTTPS request to `example.com`,
which the sandbox blocks because no network permission was granted.

## Purpose

Use this node to verify that the sandbox deny-by-default policy works:

- The node should appear in the n8n node picker as "Blocked Demo"
- Executing it should fail with an `ENOSYS` or `EACCES` error
- This confirms that `thirdPartyDeps: true` without `permissions.network`
  correctly blocks outbound network access

## Install

```bash
cd ~/.n8n/nodes
npm i /path/to/community-nodes/n8n-nodes-blocked
```

## Contrast with JSONPlaceholder node

| | JSONPlaceholder | Blocked Demo |
|---|---|---|
| `thirdPartyDeps` | `true` | `true` |
| `permissions.network` | `{ allowedHosts: [...] }` | not declared |
| Result | succeeds | blocked by sandbox |
