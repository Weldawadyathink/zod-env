# `@keawade/zod-env`

This module provides lightweight tooling for parsing environment variables in
Deno with Zod schemas while respecting Deno's permissions tooling to make
environment variable usage clear.

Permissions are requested individually for each environment variable specified
in the provided schema. Permissions can be rejected without failure as long as
the schema defines that variable as optional or provides a default value.

## Use

```bash
deno add jsr:@keawade/zod-env
```

```ts
import { parseEnv } from "jsr:@keawade/zod-env";
// or, for zod/v4
import { parseEnv } from "jsr:@keawade/zod-env/v4";

const envSchema = z.object({
  FOO: z.string(),
  PORT: z.coerce.number().default("8080"),
  BAR: z.string().optional(),
});

const parsedEnv = parseEnv();
```
