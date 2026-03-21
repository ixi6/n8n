# n8n-nodes-jsonplaceholder

Sample n8n community node that demonstrates **sandboxed execution** with
3rd-party npm dependencies.

It fetches data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
using Node.js built-in `https` and transforms responses with
[lodash](https://lodash.com/) — a 3rd-party library loaded via `require()`
inside a secure V8 isolate.

## How it works

The node declares two new description fields:

```ts
thirdPartyDeps: true,

permissions: {
  network: { allowedHosts: ['jsonplaceholder.typicode.com'] },
},
```

When n8n sees `thirdPartyDeps: true` on a node description, it runs the
node's `execute()` method inside a secure-exec V8 isolate instead of the main
process. The isolate:

- **Deny-by-default**: no filesystem, network, child_process, or env access
  unless explicitly declared via `permissions`.
- **Module access**: the node's own `node_modules/` is projected read-only
  into the sandbox, so `require('lodash')` resolves normally.
- **Network gating**: only the declared `allowedHosts` can be reached.
- **Resource limits**: memory and CPU time are capped by the n8n administrator.

## Installation

```bash
# From your n8n installation directory:
npm install n8n-nodes-jsonplaceholder
```

Or install via the n8n Community Nodes UI.

## Operations

| Resource | Operations    |
|----------|---------------|
| Post     | Get, List     |
| Comment  | Get, List     |
| User     | Get, List     |
| Todo     | Get, List     |
| Album    | Get, List     |
| Photo    | Get, List     |

## For community node developers

To enable 3rd-party imports in your node:

1. Set `thirdPartyDeps: true` in your node's `description`
2. Optionally add a `permissions` block to declare network, filesystem,
   childProcess, or env access your node needs

This tells n8n to sandbox your node and unlock `require()` for your bundled
dependencies.

See [SANDBOXING.md](../../packages/core/src/execution-engine/SANDBOXING.md)
for the full design doc.
