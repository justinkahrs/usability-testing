"use client";

import { Card, CardContent, Switch, Typography, Stack } from "@mui/material";
import type { TestingTask } from "@/context/SessionsContext";
import RichTextInput from "./RichTextInput";

interface TaskItemProps {
  task: TestingTask;
  passValue: boolean;
  commentsValue: string;
  onToggle: (taskId: string) => void;
  onCommentsChange: (taskId: string, comments: string) => void;
}

export default function TaskItem({
  task,
  passValue,
  commentsValue,
  onToggle,
  onCommentsChange,
}: TaskItemProps) {
  return (
    <Card key={task.id} variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          #{task.taskNumber}: {task.title}
        </Typography>

        {task.scenario && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Scenario:</strong> {task.scenario}
          </Typography>
        )}

        {task.instructions && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Task:</strong> {task.instructions}
          </Typography>
        )}

        {task.successCriteria && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Success Criteria:</strong> {task.successCriteria}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography>Fail</Typography>
          <Switch
            checked={passValue}
            onChange={() => onToggle(task.id)}
            color={passValue ? "success" : "error"}
          />
          <Typography>Pass</Typography>
        </Stack>

        <RichTextInput
          label="Comments"
          value={commentsValue}
          onChange={(val) => onCommentsChange(task.id, val)}
          readOnly={false}
        />
      </CardContent>
    </Card>
  );
}
