// Types of the sibling SDKs for building and typechecking without their sources (they are peer deps, resolved by package name).
declare module "@watchtowerobservability/node/next" {
  export type NextOptions = Record<string, unknown>;
  export function makeRegister(options?: NextOptions): () => Promise<void>;
  export function onRequestError(...args: unknown[]): Promise<void>;
}
declare module "@watchtowerobservability/node/next-build" {
  export interface SourcemapOptions { dir?: string; apiUrl?: string; apiKey?: string; project?: string; release?: string; keep?: boolean; inject?: boolean; fetch?: typeof fetch; log?: (line: string) => void }
  export interface WatchtowerNextOptions { sourcemaps?: boolean | (Omit<SourcemapOptions, "keep" | "release"> & { upload?: boolean; deleteAfterUpload?: boolean }); release?: string }
  type NextConfig = Record<string, unknown>;
  type ConfigOrFn = NextConfig | ((...a: unknown[]) => NextConfig | Promise<NextConfig>);
  export function withWatchtower(config?: ConfigOrFn, opts?: WatchtowerNextOptions): ConfigOrFn;
  export function uploadSourcemaps(o?: SourcemapOptions): Promise<{ uploaded: number; skipped: number; failed: number }>;
}
declare module "@watchtowerobservability/node/next-tunnel" {
  export interface TunnelOptions { endpoint: string; basePath?: string; maxBodyBytes?: number; allowKey?: string | string[]; fetch?: typeof fetch }
  export function tunnelHandler(o: TunnelOptions): { GET: (r: Request) => Promise<Response>; POST: (r: Request) => Promise<Response> };
}
declare module "@watchtowerobservability/browser" {
  export interface WatchtowerConfig { endpoint: string; publishableKey: string; service?: string; release?: string; consent?: "granted" | "pending"; [k: string]: unknown }
  export interface WatchtowerClient { grantConsent(): void; revokeConsent(): void; replay: unknown; [k: string]: unknown }
  export function init(cfg: WatchtowerConfig): WatchtowerClient;
}
declare module "@watchtowerobservability/browser/consent" {
  import type { WatchtowerClient } from "@watchtowerobservability/browser";
  export function cookieMunchConsent(wt: WatchtowerClient, map?: { rum?: string; replay?: string }): () => void;
}
declare module "@watchtowerobservability/browser/next" {
  export function useNextRouteTracking(pathname: string | null, params?: Record<string, string | string[] | undefined>): void;
}
