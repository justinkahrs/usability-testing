"use client";

import { v4 as uuid } from "uuid";
import { TestingTask } from "@/context/SessionsContext";

/**
 * Parses tasks from markdown:
 *
 * ## Task 1: Title
 *
 * **Scenario:**
 *   ...
 * **Task:**
 *   ...
 * **Success Criteria:**
 *   ...
 *
 * This regex identifies each "## Task X: Title" heading and captures
 * everything until the next heading (## Task) or end of file.
 */
export function parseTestingTasks(markdown: string): TestingTask[] {
  const tasks: TestingTask[] = [];

  // Match blocks of the form:
  // ## Task 1: Some Title
  // <contents including scenario, task, success criteria>
  // Next heading or end of file
  //
  // We handle possible Windows line endings (\r?\n).
  const taskBlockRegex = /##\s*Task\s+(\d+):\s*([^\r\n]+)\r?\n([\s\S]*?)(?=(?:\r?\n##\s*Task\s+\d+:)|$)/g;

  let match;
  while ((match = taskBlockRegex.exec(markdown)) !== null) {
    const [, taskNumber, title, block] = match;

    const scenario = captureSection(block, "Scenario");
    const instructions = captureSection(block, "Task");
    const successCriteria = captureSection(block, "Success Criteria");

    tasks.push({
      id: uuid(),
      taskNumber: taskNumber.trim(),
      title: title.trim(),
      scenario,
      instructions,
      successCriteria,
    });
  }

  return tasks;
}

/**
 * Extracts the specified label (e.g., "Scenario", "Task", "Success Criteria") from the block.
 * Matches all text until the next "**" or the end of the string.
 */
function captureSection(block: string, label: string): string {
  // Allow an optional colon after the label, e.g. "**Success Criteria**" or "**Success Criteria:**"
  const pattern = new RegExp(`\\*\\*${label}:?\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`, "i");
  const result = pattern.exec(block);
  if (!result) return "";
  return result[1].trim();
}