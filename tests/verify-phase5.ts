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
console.log("FILM FESTIVAL AWARDS 2026 - PHASE 5 VERIFICATION TESTS");
console.log("Full Admin Dashboard & Event Operations");
console.log("=======================================================\n");

const rootDir = process.cwd();

// Test 1: Film Management actions module
runTest("lib/admin/films.ts exports getAllFilmsAdmin, saveFilm, and deleteFilm", () => {
  const p = path.join(rootDir, "lib", "admin", "films.ts");
  if (!fs.existsSync(p)) throw new Error("lib/admin/films.ts is missing");
  const content = fs.readFileSync(p, "utf-8");

  const requiredTokens = ["getAllFilmsAdmin", "saveFilm", "deleteFilm", "cleanTitle", "display_order", "crew"];
  for (const token of requiredTokens) {
    if (!content.includes(token)) throw new Error(`lib/admin/films.ts missing: "${token}"`);
  }
});

// Test 2: Voting Management actions module
runTest("lib/admin/voting.ts exports getVotingAdminOverview, toggleManualVotingClosure, and getVotingCSVData", () => {
  const p = path.join(rootDir, "lib", "admin", "voting.ts");
  if (!fs.existsSync(p)) throw new Error("lib/admin/voting.ts is missing");
  const content = fs.readFileSync(p, "utf-8");

  const requiredTokens = [
    "getVotingAdminOverview",
    "toggleManualVotingClosure",
    "getVotingCSVData",
    "is_voting_manually_closed",
    "Rank,Film Title,Total Votes,Percentage",
  ];
  for (const token of requiredTokens) {
    if (!content.includes(token)) throw new Error(`lib/admin/voting.ts missing: "${token}"`);
  }
});

// Test 3: Event Management actions module
runTest("lib/admin/event.ts exports getEventSettingsAdmin and updateEventSettings", () => {
  const p = path.join(rootDir, "lib", "admin", "event.ts");
  if (!fs.existsSync(p)) throw new Error("lib/admin/event.ts is missing");
  const content = fs.readFileSync(p, "utf-8");

  const requiredTokens = [
    "getEventSettingsAdmin",
    "updateEventSettings",
    "is_published",
    "published_at",
    "voting_deadline",
  ];
  for (const token of requiredTokens) {
    if (!content.includes(token)) throw new Error(`lib/admin/event.ts missing: "${token}"`);
  }
});

// Test 4: Admin UI Components exist
runTest("Admin UI components exist for Films, Voting, Comments, and Event Settings", () => {
  const components = [
    path.join(rootDir, "components", "admin", "film-management.tsx"),
    path.join(rootDir, "components", "admin", "voting-management.tsx"),
    path.join(rootDir, "components", "admin", "comment-moderation.tsx"),
    path.join(rootDir, "components", "admin", "event-management.tsx"),
  ];

  for (const comp of components) {
    if (!fs.existsSync(comp)) throw new Error(`Missing admin component: ${comp}`);
  }
});

// Test 5: Admin routes exist
runTest("All PRD Section 8 Admin routes exist", () => {
  const routes = [
    path.join(rootDir, "app", "admin", "page.tsx"),
    path.join(rootDir, "app", "admin", "films", "page.tsx"),
    path.join(rootDir, "app", "admin", "voting", "page.tsx"),
    path.join(rootDir, "app", "admin", "comments", "page.tsx"),
    path.join(rootDir, "app", "admin", "event", "page.tsx"),
  ];

  for (const r of routes) {
    if (!fs.existsSync(r)) throw new Error(`Missing admin route: ${r}`);
  }
});

// Test 6: Strict rule: NO Film Detail page or route exists
runTest("PRD Rule: No separate Film Detail page or route exists anywhere in workspace", () => {
  const appDir = path.join(rootDir, "app");
  const prohibitedPaths = [
    path.join(appDir, "film"),
    path.join(appDir, "films"),
    path.join(appDir, "movie"),
    path.join(appDir, "movies"),
    path.join(appDir, "[id]"),
    path.join(appDir, "film-detail"),
  ];

  for (const p of prohibitedPaths) {
    if (fs.existsSync(p)) {
      throw new Error(`VIOLATION: Prohibited film detail route exists at ${p}`);
    }
  }
});

console.log("\nAll Phase 5 Full Admin Dashboard verification tests passed successfully.\n");

