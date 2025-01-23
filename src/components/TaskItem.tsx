"use client";

import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
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

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch checked={passValue} onChange={() => onToggle(task.id)} />
            }
            label="Pass / Fail"
          />
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Comments"
          value={commentsValue}
          onChange={(e) => onCommentsChange(task.id, e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
