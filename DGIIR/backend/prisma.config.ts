import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node --no-warnings=ExperimentalWarning --loader ts-node/esm prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
