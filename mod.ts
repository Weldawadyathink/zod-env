/**
 * @module This module provides lightweight tooling for parsing envionrment
 * variables in Deno with Zod schemas while respecting Deno's permissions
 * tooling to make environment variable usage clear.
 *
 * @example
 * ```ts
 * import { parseEnv } from "jsr:@keawade/zod-env";
 *
 * const envSchema = z.object({
 *   FOO: z.string(),
 *   PORT: z.coerce.number().default("8080")
 * })
 *
 * const parsedEnv = parseEnv();
 * ```
 */

export { parseEnv } from "./parseEnv.ts";
