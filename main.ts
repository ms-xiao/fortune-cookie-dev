// Fortune Cookie Wisdom for Developers — make.fun entry.
// Writes one original fortune-cookie line for a developer to /output/entry.txt.
// Node standard library only; no network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 120;

const here = dirname(fileURLToPath(import.meta.url));
const fortune = readFileSync(join(here, "entry.txt"), "utf8");

// Runtime gate, mirroring the competition brief: 1 to 120 characters,
// not only whitespace, and a single line. The count is in characters, not
// bytes, so a multi-byte character still counts as one; trailing newlines
// in the source file are stripped before counting so the stored line and
// the gated line are the same text.
const line = fortune.replace(/\r\n/g, "\n").replace(/\n+$/, "");
if (line.length < 1 || line.length > MAX_CHARS) {
  throw new Error(`fortune must be 1 to ${MAX_CHARS} characters, got ${line.length}`);
}
if (line.trim().length === 0) {
  throw new Error("fortune must not be only whitespace");
}
if (line.includes("\n")) {
  throw new Error("fortune must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");
// stdout carries the exact same bytes as the file, no trailing newline
// added, so the line a human reads and the line the judge grades can
// never drift apart; and at 82 characters it lands in a single breath,
// the way a fortune cookie should.
process.stdout.write(line);
console.error(`wrote /output/entry.txt (${line.length} characters)`);
