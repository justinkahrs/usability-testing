"use client";

import { v4 as uuid } from "uuid";
import { TestingTask } from "@/context/SessionsContext";

/**
 * Matches each "## Task X:" heading and captures everything until the next heading or end of file.
 * This ensures multi-line task details remain in a single block.
 */
export function parseTestingTasks(markdown: string): TestingTask[] {
  const tasks: TestingTask[] = [];
  // Explanation:
  // - /gs flags: "g" for global, "s" to allow dot (.) to match newlines
  // - The pattern:
  //   "##" followed by optional spaces, "Task", optional spaces, some digits, a colon, then spaces.
  //   We capture everything up to the next "## Task X:" using a negative lookahead for that pattern.
  const taskRegex = /##\s*Task\s*\d+:\s*((?:(?!##\s*Task\s*\d+:).)*)/gs;

  let match;
  while ((match = taskRegex.exec(markdown)) !== null) {
    // match[1] is the text describing the task
    const description = match[1].trim();
    tasks.push({
      id: uuid(),
      description,
    });
  }

  return tasks;
}