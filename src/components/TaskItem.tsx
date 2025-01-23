"use client";

import { Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { TestingTask } from "@/context/SessionsContext";

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
    <Box
      key={task.id}
      sx={{
        border: "1px solid #ccc",
        p: 2,
        borderRadius: 1,
        marginBottom: 2,
      }}
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        {task.description}
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={passValue}
            onChange={() => onToggle(task.id)}
          />
        }
        label="Pass / Fail"
      />
      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Comments"
        value={commentsValue}
        onChange={(e) => onCommentsChange(task.id, e.target.value)}
      />
    </Box>
  );
}