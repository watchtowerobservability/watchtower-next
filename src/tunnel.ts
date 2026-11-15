// app/api/wt/[...path]/route.ts:  export const { GET, POST } = tunnelHandler({ endpoint: process.env.WT_EDGE_URL!, allowKey: process.env.NEXT_PUBLIC_WT_KEY });
export { tunnelHandler } from "@watchtowerobservability/node/next-tunnel";
export type { TunnelOptions } from "@watchtowerobservability/node/next-tunnel";
