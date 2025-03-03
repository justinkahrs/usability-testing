"use client";
import { v4 as uuid } from "uuid";
import { TestingTask } from "@/context/SessionsContext";

export function parseTestingTasks(markdown: string): TestingTask[] {
  const tasks: TestingTask[] = [];
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
      successCriteria: successCriteria || undefined,
    });
  }
  return tasks;
}

function captureSection(block: string, label: string) {
  const pattern = new RegExp(
    `###\\s*${label}\\s*\\n([\\s\\S]*?)(?=\\n###\\s*[A-Za-z]|\\n##\\s*Task|$)`,
    "i"
  );
  const match = pattern.exec(block);
  return match ? match[1].trim() : "";
}