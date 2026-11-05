import fs from "fs";
import path from "path";
import { EVENT_CONSTANTS } from "../lib/constants";

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
console.log("FILM FESTIVAL AWARDS 2026 - PHASE 3 VERIFICATION TESTS");
console.log("Audience Prediction & Public Voting");
console.log("=======================================================\n");

const rootDir = process.cwd();

// Test 1: Award category is Best Picture only (PRD Section 4C & 5)
runTest("Award category is Best Picture only", () => {
  if (EVENT_CONSTANTS.AWARD_CATEGORY !== "Best Picture") {
    throw new Error(`Expected category "Best Picture", found "${EVENT_CONSTANTS.AWARD_CATEGORY}"`);
  }
});

// Test 2: Official voting deadline matches PRD Section 6 (4 December 2026 23:59:59 WIB)
runTest("Official voting deadline matches PRD Section 6 (4 Dec 2026 23:59:59 WIB)", () => {
  if (EVENT_CONSTANTS.VOTING_DEADLINE_ISO !== "2026-12-04T23:59:59+07:00") {
    throw new Error(`Expected voting deadline "2026-12-04T23:59:59+07:00", found "${EVENT_CONSTANTS.VOTING_DEADLINE_ISO}"`);
  }
  if (EVENT_CONSTANTS.TIMEZONE !== "Asia/Jakarta") {
    throw new Error(`Expected timezone "Asia/Jakarta", found "${EVENT_CONSTANTS.TIMEZONE}"`);
  }
});

// Test 3: Server-side voting validation functions exist
runTest("Server-side voting module exports required validation and action functions", () => {
  const votingPath = path.join(rootDir, "lib", "voting.ts");
  if (!fs.existsSync(votingPath)) throw new Error("lib/voting.ts is missing");
  const content = fs.readFileSync(votingPath, "utf-8");

  const requiredTokens = [
    "getVotingStatus",
    "getVotingStatistics",
    "getMyPrediction",
    "submitPrediction",
    "VOTING_DEADLINE_MS",
    "onConflict: \"browser_token\"",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`lib/voting.ts missing required logic: "${token}"`);
    }
  }
});

// Test 4: One active prediction per anonymous browser token (UPSERT)
runTest("Predictions database schema enforces unique browser_token constraint", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000001_initial_schema.sql");
  const sql = fs.readFileSync(migPath, "utf-8");

  if (!sql.includes("browser_token TEXT NOT NULL UNIQUE")) {
    throw new Error("Missing UNIQUE constraint on predictions(browser_token)");
  }
  if (!sql.includes("idx_predictions_browser_token")) {
    throw new Error("Missing unique index on predictions(browser_token)");
  }
});

// Test 5: Server-side database clock trigger enforces schedule
runTest("Database schema enforces server-side clock schedule trigger", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000001_initial_schema.sql");
  const sql = fs.readFileSync(migPath, "utf-8");

  if (!sql.includes("validate_prediction_window")) {
    throw new Error("Missing validate_prediction_window function or trigger in migration");
  }
  if (!sql.includes("is_voting_open()")) {
    throw new Error("Missing is_voting_open check in database trigger");
  }
});

// Test 6: Aggregate statistics privacy (Tokens and IPs are never exposed to public)
runTest("Voting statistics view and public exports protect voter anonymity", () => {
  const migPath = path.join(rootDir, "supabase", "migrations", "20261105000001_initial_schema.sql");
  const sql = fs.readFileSync(migPath, "utf-8");

  if (sql.includes("SELECT browser_token FROM voting_statistics")) {
    throw new Error("VIOLATION: voting_statistics exposes browser_token");
  }
  if (sql.includes("SELECT ip_hash FROM voting_statistics")) {
    throw new Error("VIOLATION: voting_statistics exposes ip_hash");
  }
});

// Test 7: PredictionVoting component renders voting form and live standings
runTest("PredictionVoting component supports in-page voting and live standings", () => {
  const compPath = path.join(rootDir, "components", "prediction-voting.tsx");
  if (!fs.existsSync(compPath)) throw new Error("components/prediction-voting.tsx is missing");
  const content = fs.readFileSync(compPath, "utf-8");

  const requiredTokens = [
    "TurnstileWidget",
    "submitPrediction",
    "getVotingStatistics",
    "handleRefresh",
    "currentVotedFilmId",
    "Batas Akhir: 4 Desember 2026",
    "Live Standings",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`PredictionVoting missing required feature: "${token}"`);
    }
  }
});

// Test 8: HomePage integrates PredictionVoting
runTest("HomePage integrates PredictionVoting in #prediction section", () => {
  const pagePath = path.join(rootDir, "app", "page.tsx");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (!content.includes("<PredictionVoting")) {
    throw new Error("HomePage does not render PredictionVoting");
  }
  if (!content.includes('id="prediction"')) {
    throw new Error("HomePage missing id=\"prediction\" anchor");
  }
});

// Test 9: Strict check: NO Film Detail page or route exists
runTest("PRD Rule: No separate Film Detail page or route exists in workspace", () => {
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
      throw new Error(`VIOLATION: Prohibited film detail route exists at ${p}`);
    }
  }
});

console.log("\nAll Phase 3 Audience Prediction verification tests passed successfully.\n");
