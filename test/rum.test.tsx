import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";

const { grant, revoke, initFn, track } = vi.hoisted(() => {
  const grant = vi.fn();
  const revoke = vi.fn();
  return {
    grant, revoke, track: vi.fn(),
    initFn: vi.fn((_c: Record<string, unknown>) => ({ grantConsent: grant, revokeConsent: revoke, replay: { start() {}, stop() {} } })),
  };
});
vi.mock("@watchtowerobservability/browser", () => ({ init: initFn }));
vi.mock("@watchtowerobservability/browser/next", () => ({ useNextRouteTracking: track }));
vi.mock("next/navigation", () => ({ usePathname: () => "/a/1", useParams: () => ({ id: "1" }) }));

import { WatchtowerRUM, getWatchtower } from "../src/rum";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => vi.unstubAllEnvs());

it("inits the browser SDK once, consent pending until Cookie Munch answers, tracks the route", async () => {
  vi.stubEnv("NEXT_PUBLIC_WT_RELEASE", "sha123");
  const root = createRoot(document.createElement("div"));
  await act(async () => root.render(createElement(WatchtowerRUM, { rumKey: "wtp_k_1" })));
  await act(async () => root.render(createElement(WatchtowerRUM, { rumKey: "wtp_k_1" })));
  expect(initFn).toHaveBeenCalledTimes(1);
  expect(initFn.mock.calls[0]![0]).toMatchObject({ publishableKey: "wtp_k_1", endpoint: "/api/wt", release: "sha123", consent: "pending" });
  expect(getWatchtower()).toBeDefined();
  expect(track).toHaveBeenCalledWith("/a/1", { id: "1" });
  expect(grant).not.toHaveBeenCalled(); // CookieMunch not answered yet
  (window as unknown as { CookieMunch: unknown }).CookieMunch = { hasResponse: true, consent: { statistics: true } };
  window.dispatchEvent(new Event("CookieMunchOnChange"));
  expect(grant).toHaveBeenCalledTimes(1);
  act(() => root.unmount());
});
