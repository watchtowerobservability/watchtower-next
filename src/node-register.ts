// Only ever loaded on the Node.js runtime (see index.ts).
import { makeRegister, onRequestError as report } from "@watchtowerobservability/node/next";
import type { RegisterOptions } from "./types.js";

export const register = (options?: RegisterOptions): Promise<void> => makeRegister(options)();
export const onRequestError = report;
