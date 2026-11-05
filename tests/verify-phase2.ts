import fs from "fs";
import path from "path";
import { INITIAL_FILMS } from "../lib/films";

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
console.log("FILM FESTIVAL AWARDS 2026 - PHASE 2 VERIFICATION TESTS");
console.log("Film Showcase & Grand Cinematic Visual Experience");
console.log("=======================================================\n");

const rootDir = process.cwd();

// Test 1: Exactly 10 participating student films
runTest("Exactly 10 participating student films exist with complete attributes", () => {
  if (!INITIAL_FILMS || INITIAL_FILMS.length !== 10) {
    throw new Error(`Expected 10 films, found ${INITIAL_FILMS.length}`);
  }

  INITIAL_FILMS.forEach((film, index) => {
    if (!film.title || film.title.trim() === "") {
      throw new Error(`Film at index ${index} missing title`);
    }
    if (!film.short_description || film.short_description.trim() === "") {
      throw new Error(`Film "${film.title}" missing short_description`);
    }
    if (!film.poster_url || !film.poster_url.startsWith("http")) {
      throw new Error(`Film "${film.title}" missing valid poster_url`);
    }
    if (!Array.isArray(film.crew) || film.crew.length === 0) {
      throw new Error(`Film "${film.title}" missing crew members`);
    }
    film.crew.forEach((c) => {
      if (!c.name || !c.role) {
        throw new Error(`Film "${film.title}" has incomplete crew data`);
      }
    });
  });
});

// Test 2: Film Showcase component exists
runTest("FilmShowcase component exists and renders on single page", () => {
  const showcasePath = path.join(rootDir, "components", "film-showcase.tsx");
  if (!fs.existsSync(showcasePath)) throw new Error("film-showcase.tsx is missing");
  const content = fs.readFileSync(showcasePath, "utf-8");

  if (!content.includes("FilmCard")) throw new Error("FilmShowcase does not use FilmCard");
  if (!content.includes("filteredFilms.map")) throw new Error("FilmShowcase missing film mapping");
  if (!content.includes("selectedGenre")) throw new Error("FilmShowcase missing genre filter");
});

// Test 3: FilmCard component renders poster, title, genre, duration, synopsis, and crew photographs
runTest("FilmCard component conforms to PRD Section 4B attributes", () => {
  const cardPath = path.join(rootDir, "components", "film-card.tsx");
  if (!fs.existsSync(cardPath)) throw new Error("film-card.tsx is missing");
  const content = fs.readFileSync(cardPath, "utf-8");

  const requiredTokens = [
    "film.poster_url",
    "film.title",
    "film.genre",
    "film.duration",
    "film.short_description",
    "film.crew",
    "member.photo_url",
    "member.name",
    "member.role",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`FilmCard missing required PRD attribute rendering: "${token}"`);
    }
  }
});

// Test 4: HeroSection component exists and includes PRD Section 4A requirements
runTest("HeroSection includes official event logo, title, countdown, dates, venue, and buttons", () => {
  const heroPath = path.join(rootDir, "components", "hero-section.tsx");
  if (!fs.existsSync(heroPath)) throw new Error("hero-section.tsx is missing");
  const content = fs.readFileSync(heroPath, "utf-8");

  const requiredTokens = [
    "CountdownTimer",
    "EVENT_CONSTANTS.TITLE",
    "Grand Cinematic Awards",
    "EVENT_CONSTANTS.EVENT_DATES",
    "EVENT_CONSTANTS.VENUE",
    "Explore Films (10)",
    "Predict the Best Picture",
    "Featured Nominee Posters",
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`HeroSection missing required element: "${token}"`);
    }
  }
});

// Test 5: CountdownTimer targets the premiere date (8 December 2026)
runTest("CountdownTimer is configured for 8 December 2026", () => {
  const timerPath = path.join(rootDir, "components", "countdown-timer.tsx");
  if (!fs.existsSync(timerPath)) throw new Error("countdown-timer.tsx is missing");
  const content = fs.readFileSync(timerPath, "utf-8");

  if (!content.includes("2026-12-08")) {
    throw new Error("CountdownTimer does not target 8 December 2026 premiere");
  }
});

// Test 6: Strict check: NO Film Detail route or page exists
runTest("PRD Rule: No separate Film Detail page or route exists in workspace", () => {
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

// Test 7: HomePage integrates HeroSection and FilmShowcase
runTest("HomePage integrates HeroSection and FilmShowcase on root route", () => {
  const pagePath = path.join(rootDir, "app", "page.tsx");
  if (!fs.existsSync(pagePath)) throw new Error("app/page.tsx is missing");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (!content.includes("<HeroSection")) throw new Error("HomePage does not render HeroSection");
  if (!content.includes("<FilmShowcase")) throw new Error("HomePage does not render FilmShowcase");
  if (!content.includes('id="films"')) throw new Error('HomePage missing id="films" anchor');
  if (!content.includes('id="prediction"')) throw new Error('HomePage missing id="prediction" anchor');
});

console.log("\nAll Phase 2 Film Showcase verification tests passed successfully.\n");
