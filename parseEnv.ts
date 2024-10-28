import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import {
  type UnknownKeysParam,
  ZodFirstPartyTypeKind,
  ZodObject,
  type ZodRawShape,
  type ZodTypeAny,
} from "https://deno.land/x/zod@v3.23.8/types.ts";

export const parseEnv = <
  T extends ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny>,
>(
  schema: T,
): z.infer<typeof schema> => {
  if (schema._def.typeName !== ZodFirstPartyTypeKind.ZodObject) {
    throw new Error("Invalid schema. Must extend z.object.");
  }

  // Populate object to validate
  const vars: Record<string, string | undefined> = {};
  for (const key in schema._def.shape()) {
    vars[key] = Deno.env.get(key);
  }

  return schema.parse(vars);
};
