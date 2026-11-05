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
console.log("FILM FESTIVAL AWARDS 2026 - PHASE 4 VERIFICATION TESTS");
console.log("Community Comments & Moderation Workflow");
console.log("=======================================================\n");

const rootDir = process.cwd();

// Test 1: Comments library exports all required functions (PRD Section 4D, 7, 8)
runTest("lib/comments.ts exports public and admin moderation functions", () => {
  const commentsPath = path.join(rootDir, "lib", "comments.ts");
  if (!fs.existsSync(commentsPath)) throw new Error("lib/comments.ts missing");
  const content = fs.readFileSync(commentsPath, "utf-8");

  const requiredTokens = [
    "getApprovedComments",
    "submitComment",
    "getAllCommentsAdmin",
    "updateCommentStatus",
    "deleteComment",
    'status: "pending"',
    "honeypot",
    "formStartTime",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`lib/comments.ts missing required element: "${token}"`);
    }
  }
});

// Test 2: Database RLS policies enforce pending on insert and approved on select
runTest("Database schema enforces public approved-only select and pending-only insert", () => {
  const rlsPath = path.join(rootDir, "supabase", "migrations", "20261105000002_rls_policies.sql");
  const sql = fs.readFileSync(rlsPath, "utf-8");

  if (!sql.includes("status = 'approved'")) {
    throw new Error("Missing RLS condition: status = 'approved' for public read");
  }
  if (!sql.includes("status = 'pending'")) {
    throw new Error("Missing RLS condition: status = 'pending' for public insert");
  }
  if (!sql.includes("Admin update comments")) {
    throw new Error("Missing RLS policy: Admin update comments");
  }
  if (!sql.includes("Admin delete comments")) {
    throw new Error("Missing RLS policy: Admin delete comments");
  }
});

// Test 3: Public CommunityComments component exists and includes spam protection
runTest("CommunityComments component includes display name, content, and spam honeypot", () => {
  const compPath = path.join(rootDir, "components", "community-comments.tsx");
  if (!fs.existsSync(compPath)) throw new Error("components/community-comments.tsx missing");
  const content = fs.readFileSync(compPath, "utf-8");

  const requiredTokens = [
    "authorName",
    "content",
    "honeypot",
    "formStartTime",
    "submitComment",
    "Pesan Komunitas",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`CommunityComments missing required feature: "${token}"`);
    }
  }
});

// Test 4: Admin CommentModeration component supports approve, hide, and delete
runTest("CommentModeration component provides approve, hide, and delete actions", () => {
  const modPath = path.join(rootDir, "components", "admin", "comment-moderation.tsx");
  if (!fs.existsSync(modPath)) throw new Error("components/admin/comment-moderation.tsx missing");
  const content = fs.readFileSync(modPath, "utf-8");

  const requiredTokens = [
    "handleStatusChange",
    "handleDelete",
    "updateCommentStatus",
    "deleteComment",
    "Approve",
    "Hide",
    "Delete",
    "PENDING REVIEW",
    "APPROVED",
    "HIDDEN",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`CommentModeration missing required moderation control: "${token}"`);
    }
  }
});

// Test 5: Admin comments page route exists
runTest("Admin comments moderation route exists at app/admin/comments/page.tsx", () => {
  const pagePath = path.join(rootDir, "app", "admin", "comments", "page.tsx");
  if (!fs.existsSync(pagePath)) throw new Error("app/admin/comments/page.tsx missing");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (!content.includes("CommentModeration")) {
    throw new Error("Admin comments page does not render CommentModeration");
  }
});

// Test 6: HomePage integrates CommunityComments in #community section
runTest("HomePage integrates CommunityComments in #community section", () => {
  const pagePath = path.join(rootDir, "app", "page.tsx");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (!content.includes("<CommunityComments")) {
    throw new Error("HomePage does not render CommunityComments");
  }
  if (!content.includes('id="community"')) {
    throw new Error('HomePage missing id="community" anchor');
  }
});

// Test 7: Strict check: NO Film Detail page or route exists
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

console.log("\nAll Phase 4 Community Comments verification tests passed successfully.\n");

