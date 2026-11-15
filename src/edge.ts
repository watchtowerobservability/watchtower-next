// Resolved by the `edge-light` / `worker` / `browser` export conditions: nothing here imports the node SDK or node:*.
export type { RegisterOptions } from "./types.js";

/** Edge runtime: the node SDK does not run there, so this is a no-op. */
export async function register(_options?: unknown): Promise<void> {}

/** Edge runtime: no-op. */
export async function onRequestError(..._args: unknown[]): Promise<void> {}
