# @watchtowerobservability/next

Watchtower for Next.js (app router, `output: 'standalone'`). Peers: `@watchtowerobservability/node` (server), `@watchtowerobservability/browser` (RUM), `next`, `react`. The ESM-only package needs `next.config.mjs`/`.ts`; CommonJS configs can use `@watchtowerobservability/node/next-build` instead.

```ts
// instrumentation.ts: safe in the edge compile; the node SDK loads only on the Node.js runtime (WT_INGEST_KEY)
// One file, no `instrumentation.node.ts` split: the edge-light/worker export conditions resolve a no-op there.
export { register, onRequestError } from '@watchtowerobservability/next';
// with options instead of the line above:
// import { register as wt } from '@watchtowerobservability/next';
// export const register = () => wt({ redact: 'pii' });
```

This is the preferred entry point; `@watchtowerobservability/node/next` and `/next-build` are deprecated and still work. After `next build`, run `npx wt-next-doctor`: it checks that `.next/standalone` can load the SDK and each OpenTelemetry package, and exits 1 naming any that fail. `output: 'standalone'` is handled by `withWatchtower` (no `outputFileTracingIncludes` or `serverExternalPackages` of your own; npm, pnpm and monorepos).

```js
// next.config.mjs: standalone works with no other config (node SDK + OpenTelemetry peers traced and externalized)
import { withWatchtower } from '@watchtowerobservability/next/config';
export default withWatchtower(nextConfig, { sourcemaps: { upload: true, deleteAfterUpload: true } });
```
`sourcemaps.upload` runs after the webpack client build and needs `WT_API_KEY` (scope `ci:write`) and `WT_PROJECT`; the release is `WT_RELEASE` or the CI git sha (it is also exposed as `NEXT_PUBLIC_WT_RELEASE`). Turbopack: use `sourcemaps: true` and `next build && wt-next-sourcemaps`.

```tsx
// app/layout.tsx
import { WatchtowerRUM } from '@watchtowerobservability/next/rum';
<WatchtowerRUM rumKey={process.env.NEXT_PUBLIC_WT_KEY!} />   // consent="cookiemunch" (default) | "pending" | "granted"
```
It starts the browser SDK once (endpoint `/api/wt`, the tunnel; `release` defaults to `NEXT_PUBLIC_WT_RELEASE`, which `withWatchtower` sets from `WT_RELEASE` or the CI git sha), follows Cookie Munch consent and reports app router route patterns.

```ts
// app/api/wt/[...path]/route.ts
import { tunnelHandler } from '@watchtowerobservability/next/tunnel';
export const { GET, POST } = tunnelHandler({ endpoint: process.env.WT_EDGE_URL!, allowKey: process.env.NEXT_PUBLIC_WT_KEY });
```
The tunnel forwards the visitor's `Origin` (and `Referer`) to the edge, which checks it against the key's allowed origins: add your site's origin (for example `https://app.example.com`) to the publishable key, or the edge answers 403 `origin_not_allowed`. `allowKey` refuses beacons for any other key.
