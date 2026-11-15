# Changelog

## 0.1.0 (2026-11-15)

- First release. `register()` / `onRequestError` for `instrumentation.ts` that are safe in the edge compile (export conditions `edge-light`, `worker`, `browser` resolve a no-op entry; the node SDK is imported only behind `NEXT_RUNTIME === 'nodejs'`); `/config` (`withWatchtower`: standalone tracing, externals, release, source map upload); `/tunnel` (`tunnelHandler` with Origin forwarding and `allowKey`); `/rum` (`<WatchtowerRUM>` with Cookie Munch consent and app router tracking).
