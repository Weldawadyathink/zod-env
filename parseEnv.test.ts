import { expect } from "jsr:@std/expect";
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import z from "https://deno.land/x/zod@v3.23.8/mod.ts";

import { parseEnv } from "./parseEnv.ts";

describe("validateEnv", () => {
  const testEnv: Record<string, string> = {
    TEST_FOO: "foo",
    TEST_BAR: "42",
    TEST_BAZ: "true",
  };

  beforeAll(() => {
    for (const name in testEnv) {
      Deno.env.set(name, testEnv[name]);
    }
  });

  afterAll(() => {
    for (const name in testEnv) {
      Deno.env.delete(name);
    }
  });

  it("should throw an error if schema does not extend z.object", () => {
    expect.hasAssertions();

    try {
      parseEnv(z.string() as any);
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid schema. Must extend z.object.");
    }
  });

  it("should handle empty schema", () => {
    const actual = parseEnv(z.object({}));

    expect(actual).toEqual({});
  });

  it("should only get requested env vars", () => {
    const actual = parseEnv(z.object({ TEST_FOO: z.string() }));

    expect(actual).toEqual({ TEST_FOO: "foo" });
  });
});
