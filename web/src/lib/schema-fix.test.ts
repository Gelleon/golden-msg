import prisma from "./db";
import { ensureSchemaFixed } from "./schema-fix";

jest.mock("./db", () => ({
  $executeRawUnsafe: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("./legacy-data-migrate", () => ({
  ensureLegacyDataMigrated: jest.fn().mockResolvedValue(undefined),
}));

describe("ensureSchemaFixed", () => {
  it("does not backfill email verification for unverified users", async () => {
    await ensureSchemaFixed();

    const executedSql = (prisma.$executeRawUnsafe as jest.Mock).mock.calls
      .map(([sql]) => String(sql))
      .join("\n");

    expect(executedSql).toContain('ADD COLUMN "email_verified_at"');
    expect(executedSql).not.toMatch(/UPDATE\s+"?\w+"?\s+SET\s+"email_verified_at"/i);
  });
});
