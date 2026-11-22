# Changelog

## 0.1.2 (2026-11-18)

- `@watchtowerobservability/next` is now the documented entry point: the README leads with it, `withWatchtower()` (from `/config`; `output: 'standalone'` is handled) and `npx wt-next-doctor` after `next build`. `@watchtowerobservability/node/next` and `/next-build` are deprecated in the node SDK 0.8.1 (still working), and `/config` now wraps `withWatchtower` / `uploadSourcemaps` instead of re-exporting them, so the node SDK's deprecation tags do not show on this package's exports. Works with node 0.7.9 or later; 0.8.1 adds the "loaded too late" warning, the startup status line and `WT_DEBUG`. `register`, `onRequestError` and the edge no-op are unchanged.

## 0.1.1 (2026-11-16)

- Needs `@watchtowerobservability/node` 0.7.9 or later: `withWatchtower` standalone builds work under pnpm and in monorepos (each OpenTelemetry peer is traced with its own dependencies), and `wt-next-doctor` checks that each peer loads. See the node SDK changelog.

## 0.1.0 (2026-11-15)

- First release. `register()` / `onRequestError` for `instrumentation.ts` that are safe in the edge compile (export conditions `edge-light`, `worker`, `browser` resolve a no-op entry; the node SDK is imported only behind `NEXT_RUNTIME === 'nodejs'`); `/config` (`withWatchtower`: standalone tracing, externals, release, source map upload); `/tunnel` (`tunnelHandler` with Origin forwarding and `allowKey`); `/rum` (`<WatchtowerRUM>` with Cookie Munch consent and app router tracking).
