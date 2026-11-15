import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";

const { reg, onErr } = vi.hoisted(() => ({ reg: vi.fn(async (_o?: unknown) => {}), onErr: vi.fn(async (..._a: unknown[]) => {}) }));
vi.mock("../src/node-register.js", () => ({ register: reg, onRequestError: onErr }));

import { onRequestError, register } from "../src/index";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

it("register is a no-op off the nodejs runtime and never loads the node entry", async () => {
  vi.stubEnv("NEXT_RUNTIME", "edge");
  await register({ apiKey: "k" });
  await onRequestError(new Error("x"));
  expect(reg).not.toHaveBeenCalled();
  expect(onErr).not.toHaveBeenCalled();
});

it("register on nodejs loads the node entry with the options", async () => {
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  await register({ apiKey: "k" });
  expect(reg).toHaveBeenCalledWith({ apiKey: "k" });
  const e = new Error("boom");
  await onRequestError(e, { path: "/p" }, { routePath: "/p" });
  expect(onErr).toHaveBeenCalledWith(e, { path: "/p" }, { routePath: "/p" });
});

it("the edge entry imports nothing but types, and the exports map points edge conditions at it", () => {
  const edge = readFileSync(join(process.cwd(), "src/edge.ts"), "utf8");
  const code = edge.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  expect(code.match(/^(import|export) .* from /gm)?.every((l) => /^(import|export) type /.test(l))).toBe(true);
  expect(code).not.toMatch(/node:|@watchtowerobservability\/node['"]/);
  const root = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).exports["."];
  for (const c of ["edge-light", "worker", "browser"]) expect(root[c]).toBe("./dist/edge.js");
  expect(root.node).toBe("./dist/index.js");
  expect(root.default).toBe("./dist/index.js");
  expect(Object.keys(root)[0]).toBe("types");
});
