"use client";

import { Card, CardContent, Typography, Stack, Chip, TextField } from "@mui/material";
import { TestingTask } from "@/context/SessionsContext";

interface UserTestTaskItemProps {
  task: TestingTask;
  pass: boolean;
  comments: string;
}

export default function UserTestTaskItem({ task, pass, comments }: UserTestTaskItemProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          #{task.taskNumber}: {task.title}
        </Typography>

        {task.scenario && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Scenario:</strong> {task.scenario}
          </Typography>
        )}

        {task.instructions && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Task:</strong> {task.instructions}
          </Typography>
        )}

        {task.successCriteria && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Success Criteria:</strong> {task.successCriteria}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={pass ? "Pass" : "Fail"}
            color={pass ? "success" : "error"}
            variant="filled"
          />
        </Stack>

        <TextField
          fullWidth
          multiline
          InputProps={{ readOnly: true }}
          minRows={3}
          label="Comments"
          value={comments}
        />
      </CardContent>
    </Card>
  );
}