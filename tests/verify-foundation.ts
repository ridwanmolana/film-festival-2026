import fs from "fs";
import path from "path";

function runTest(testName: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ [FAIL] ${testName}: ${msg}`);
    process.exitCode = 1;
  }
}

console.log("\n=======================================================");
console.log("FILM FESTIVAL AWARDS 2026 - PHASE 1 VERIFICATION TESTS");
console.log("Single Source of Truth: PRD.md");
console.log("=======================================================\n");

const rootDir = process.cwd();

// Test 1: PRD.md integrity
runTest("PRD.md exists and is untouched as Single Source of Truth", () => {
  const prdPath = path.join(rootDir, "PRD.md");
  if (!fs.existsSync(prdPath)) {
    throw new Error("PRD.md is missing from project root");
  }
  const content = fs.readFileSync(prdPath, "utf-8");
  if (!content.includes("FILM FESTIVAL AWARDS 2026")) {
    throw new Error("PRD.md does not contain expected header");
  }
  if (!content.includes("SMP Global Prestasi Bekasi")) {
    throw new Error("PRD.md does not contain school name");
  }
  if (!content.includes("4 December 2026, 23:59:59 WIB")) {
    throw new Error("PRD.md does not contain voting deadline");
  }
  if (!content.includes("No separate Film Detail page is required")) {
    throw new Error("PRD.md does not contain Film Detail exclusion rule");
  }
});

// Test 2: Database Migration 1 (Initial Schema)
runTest("Migration 1 (initial schema) contains all required tables, triggers, and views", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000001_initial_schema.sql");
  if (!fs.existsSync(migPath)) throw new Error("Migration 1 is missing");
  const sql = fs.readFileSync(migPath, "utf-8");

  const requiredTokens = [
    "CREATE TABLE IF NOT EXISTS event_settings",
    "CREATE TABLE IF NOT EXISTS films",
    "CREATE TABLE IF NOT EXISTS predictions",
    "CREATE TABLE IF NOT EXISTS comments",
    "is_voting_open()",
    "validate_prediction_window",
    "CREATE OR REPLACE VIEW voting_statistics",
    "get_voting_summary",
    "2026-12-04 23:59:59+07",
    "SMP Global Prestasi Bekasi",
  ];

  for (const token of requiredTokens) {
    if (!sql.includes(token)) {
      throw new Error(`Migration 1 missing required element: "${token}"`);
    }
  }
});

// Test 3: Database Migration 2 (RLS Policies)
runTest("Migration 2 contains strict Row Level Security policies", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000002_rls_policies.sql");
  if (!fs.existsSync(migPath)) throw new Error("Migration 2 is missing");
  const sql = fs.readFileSync(migPath, "utf-8");

  const requiredTokens = [
    "ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE films ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE comments ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE predictions ENABLE ROW LEVEL SECURITY",
    "Public read approved comments",
    "Public submit pending comments",
    "Admin read all comments",
    "Admin read all predictions",
  ];

  for (const token of requiredTokens) {
    if (!sql.includes(token)) {
      throw new Error(`Migration 2 missing RLS policy: "${token}"`);
    }
  }
});

// Test 4: Database Migration 3 (Storage Buckets)
runTest("Migration 3 configures film-assets storage bucket and policies", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000003_storage_buckets.sql");
  if (!fs.existsSync(migPath)) throw new Error("Migration 3 is missing");
  const sql = fs.readFileSync(migPath, "utf-8");

  if (!sql.includes("film-assets")) throw new Error("Storage bucket film-assets not configured");
  if (!sql.includes("Public read film assets")) throw new Error("Public read storage policy missing");
  if (!sql.includes("Admin upload film assets")) throw new Error("Admin upload storage policy missing");
});

// Test 5: Seed Data contains exactly 10 student films
runTest("Seed data defines initial event settings and exactly 10 participating films", () => {
  const seedPath = path.join(rootDir, "supabase", "seed.sql");
  if (!fs.existsSync(seedPath)) throw new Error("Seed SQL file missing");
  const sql = fs.readFileSync(seedPath, "utf-8");

  // Check 10 films are inserted
  const filmMatches = sql.match(/11111111-1111-1111-1111-1111111111\d\d/g);
  if (!filmMatches || filmMatches.length !== 10) {
    throw new Error(`Expected exactly 10 seeded films, found: ${filmMatches?.length ?? 0}`);
  }

  if (!sql.includes("SMP Global Prestasi Bekasi")) throw new Error("Seed missing school name");
  if (!sql.includes("GPS Theater")) throw new Error("Seed missing GPS Theater");
  if (!sql.includes("Film Festival Awards 2026")) throw new Error("Seed missing event title");
});

// Test 6: Verify NO Film Detail route or page exists
runTest("Strict Rule: No Film Detail page or route exists in the workspace", () => {
  const appDir = path.join(rootDir, "app");
  const prohibitedPaths = [
    path.join(appDir, "film"),
    path.join(appDir, "films"),
    path.join(appDir, "movie"),
    path.join(appDir, "movies"),
    path.join(appDir, "[id]"),
  ];

  for (const p of prohibitedPaths) {
    if (fs.existsSync(p)) {
      throw new Error(`VIOLATION: Prohibited film detail route directory exists at ${p}`);
    }
  }
});

// Test 7: Verify Supabase clients, middleware and auth utilities
runTest("Supabase client utilities and admin authentication exist", () => {
  const requiredFiles = [
    path.join(rootDir, "lib", "supabase", "client.ts"),
    path.join(rootDir, "lib", "supabase", "server.ts"),
    path.join(rootDir, "lib", "supabase", "admin.ts"),
    path.join(rootDir, "lib", "supabase", "middleware.ts"),
    path.join(rootDir, "lib", "auth.ts"),
    path.join(rootDir, "lib", "constants.ts"),
  ];

  for (const f of requiredFiles) {
    if (!fs.existsSync(f)) throw new Error(`Missing expected foundation file: ${f}`);
  }

  // Next.js 16 supports proxy.ts (preferred) or middleware.ts
  const hasProxyOrMiddleware =
    fs.existsSync(path.join(rootDir, "proxy.ts")) ||
    fs.existsSync(path.join(rootDir, "middleware.ts"));
  if (!hasProxyOrMiddleware) {
    throw new Error("Missing proxy.ts or middleware.ts");
  }
});

// Test 8: Verify Environment Variables configuration
runTest(".env.example is properly configured", () => {
  const envExamplePath = path.join(rootDir, ".env.example");
  if (!fs.existsSync(envExamplePath)) throw new Error(".env.example is missing");
  const content = fs.readFileSync(envExamplePath, "utf-8");

  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_TIMEZONE",
    "NEXT_PUBLIC_VOTING_DEADLINE",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  ];

  for (const v of requiredVars) {
    if (!content.includes(v)) throw new Error(`.env.example missing required variable: ${v}`);
  }
});

// Test 9: TypeScript Database Types exist and export Database interface
runTest("TypeScript database types define public schema with tables and views", () => {
  const dbTypesPath = path.join(rootDir, "types", "database.types.ts");
  if (!fs.existsSync(dbTypesPath)) throw new Error("database.types.ts is missing");
  const content = fs.readFileSync(dbTypesPath, "utf-8");

  if (!content.includes("export interface Database")) throw new Error("Database interface missing");
  if (!content.includes("event_settings:")) throw new Error("event_settings table definition missing");
  if (!content.includes("films:")) throw new Error("films table definition missing");
  if (!content.includes("predictions:")) throw new Error("predictions table definition missing");
  if (!content.includes("comments:")) throw new Error("comments table definition missing");
  if (!content.includes("voting_statistics:")) throw new Error("voting_statistics view definition missing");
});

console.log("\nAll Phase 1 Foundation verification tests passed successfully.\n");

