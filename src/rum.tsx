"use client";
import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { init, type WatchtowerClient, type WatchtowerConfig } from "@watchtowerobservability/browser";
import { cookieMunchConsent } from "@watchtowerobservability/browser/consent";
import { useNextRouteTracking } from "@watchtowerobservability/browser/next";

export interface WatchtowerRUMProps {
  /** Publishable key (`wtp_...`). */
  rumKey: string;
  /** Default `process.env.NEXT_PUBLIC_WT_RELEASE` (set by `withWatchtower` from WT_RELEASE or the CI git sha). */
  release?: string;
  /**
   * `"cookiemunch"` (default): wait for the visitor's Cookie Munch choice (`statistics` starts RUM, withdrawing stops it).
   * `"pending"`: wait for you to call `getWatchtower()?.grantConsent()`. `"granted"`: start at once.
   */
  consent?: "cookiemunch" | "pending" | "granted";
  /** Edge base URL or your tunnel route; default `/api/wt` (see `tunnelHandler`). */
  endpoint?: string;
  /** Default `NEXT_PUBLIC_WT_SERVICE`, then `web`. */
  service?: string;
  /** Any other browser SDK option (`propagateTo`, `urlScrubbing`, `replay`, ...). */
  config?: Partial<WatchtowerConfig>;
}

let client: WatchtowerClient | undefined;

/** The client `<WatchtowerRUM>` started (undefined before it mounted). */
export const getWatchtower = (): WatchtowerClient | undefined => client;

/** Renders nothing: starts the browser SDK once, bridges Cookie Munch consent and reports app router route changes. Put it in the root layout. */
export function WatchtowerRUM({ rumKey, release, consent = "cookiemunch", endpoint = "/api/wt", service, config }: WatchtowerRUMProps): null {
  useEffect(() => {
    client ??= init({
      endpoint,
      service: service ?? process.env.NEXT_PUBLIC_WT_SERVICE ?? "web",
      release: release ?? process.env.NEXT_PUBLIC_WT_RELEASE,
      ...config,
      publishableKey: rumKey,
      consent: consent === "granted" ? "granted" : "pending",
    });
    return consent === "cookiemunch" ? cookieMunchConsent(client) : undefined;
    // start once: later prop changes do not re-init (the client is a singleton)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rumKey, consent]);
  useNextRouteTracking(usePathname(), useParams() as Record<string, string | string[] | undefined>);
  return null;
}
