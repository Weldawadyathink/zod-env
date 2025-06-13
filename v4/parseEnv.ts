import type {
  infer as zInfer,
  ZodObject,
} from "npm:zod@3/v4";

/**
 * This function parses the current environment's variables using the provided
 * Zod schema.
 *
 * Environment variable permissions are requested individually so usage is
 * clear.
 *
 * Environment variable permissions can be refused without error for optional
 * values in the schema or when a default value is provided by the schema.
 *
 * @param schema The Zod schema to use to parse the environment variables.
 * @returns Parsed environment variables.
 */
export const parseEnv = <
  T extends ZodObject,
>(schema: T): zInfer<typeof schema> => {
  if (schema._zod.def.type !== "object") {
    throw new Error("Invalid schema. Must extend z.object.");
  }

  // Populate object to validate
  const vars: Record<string, string | undefined> = {};
  for (const key in schema.shape) {
    if (
      Deno.permissions.requestSync({ name: "env", variable: key }).state ===
      "granted"
    ) {
      vars[key] = Deno.env.get(key);
    }
  }

  return schema.parse(vars);
};
