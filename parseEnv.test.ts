import { expect } from "jsr:@std/expect";
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { z } from "npm:zod@3";

import { parseEnv } from "./parseEnv.ts";

describe("validateEnv", () => {
  const testEnv: Record<string, string> = {
    TEST_FOO: "foo",
    TEST_BAR: "42",
    TEST_BAZ: "false",
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
    expect(
      Deno.permissions.querySync({ name: "env", variable: "TEST_FOO" })
        .state,
      "Expected env.TEST_FOO permissions for this test!",
    ).toBe("granted");
    expect(
      Deno.permissions.querySync({
        name: "env",
        variable: "TEST_BAR",
      })
        .state,
      "Expected env.TEST_BAR permissions for this test!",
    ).toBe("granted");
    expect(
      Deno.permissions.querySync({
        name: "env",
        variable: "TEST_BAZ",
      })
        .state,
      "Expected env.TEST_BAZ permissions for this test!",
    ).toBe("granted");

    const actual = parseEnv(
      z.object({
        TEST_FOO: z.string(),
        TEST_BAR: z.coerce.number(),
        TEST_BAZ: z.enum(["true", "false"]).transform((val) => val === "true"),
      }),
    );

    expect(actual).toEqual({
      TEST_FOO: "foo",
      TEST_BAR: 42,
      TEST_BAZ: false,
    });
  });

  it("should fallback to default or optional if denied permissions", () => {
    expect(
      Deno.permissions.querySync({ name: "env", variable: "TEST_NOT_ALLOWED" })
        .state,
    ).toBe("prompt");
    expect(
      Deno.permissions.querySync({
        name: "env",
        variable: "TEST_ALSO_NOT_ALLOWED",
      })
        .state,
    ).toBe("prompt");

    const actual = parseEnv(
      z.object({
        TEST_NOT_ALLOWED: z.string().default("It's okay."),
        TEST_ALSO_NOT_ALLOWED: z.string().optional(),
      }),
    );

    expect(actual).toEqual({
      TEST_NOT_ALLOWED: "It's okay.",
    });
  });
});
