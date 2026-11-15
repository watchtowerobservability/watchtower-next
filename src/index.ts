// instrumentation.ts:  export { register, onRequestError } from '@watchtowerobservability/next';
//   with options:      import { register as wt } from '@watchtowerobservability/next'; export const register = () => wt({ redact: 'pii' });
// The edge bundle resolves ./edge.js (export conditions); the node one lands here, where the node SDK is only
// imported behind NEXT_RUNTIME === 'nodejs', so it never reaches the edge compile.
import type { RegisterOptions } from "./types.js";

export type { RegisterOptions } from "./types.js";

/** Next.js `register()`: init the node SDK on the Node.js runtime (WT_INGEST_KEY or `options.apiKey`); no-op on edge. */
export async function register(options?: RegisterOptions): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const m = await import("./node-register.js");
    await m.register(options);
  }
}

/** Next.js `onRequestError`: server render, route handler and server action errors (Node.js runtime only). */
export async function onRequestError(...args: Parameters<typeof import("./node-register.js").onRequestError>): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const m = await import("./node-register.js");
    await m.onRequestError(...args);
  }
}
