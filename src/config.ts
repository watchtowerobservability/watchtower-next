// next.config.mjs:  import { withWatchtower } from '@watchtowerobservability/next/config';
// Wrapped (not re-exported) so the node SDK's deprecation of its own /next-build entry does not show on these.
import { uploadSourcemaps as upload, withWatchtower as wrap } from "@watchtowerobservability/node/next-build";

/** Next config wrapper: standalone tracing (`output: 'standalone'` works), externals, release, optional source map upload. */
export const withWatchtower: typeof wrap = (config, opts) => wrap(config, opts);
/** Upload `.next/static/**\/*.map`; the `wt-next-sourcemaps` bin does the same after `next build`. */
export const uploadSourcemaps: typeof upload = (o) => upload(o);
export type { WatchtowerNextOptions, SourcemapOptions } from "@watchtowerobservability/node/next-build";
