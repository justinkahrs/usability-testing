"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";

interface AnalysisDialogProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  analysis:
    | {
        overallPassRate?: string; // "85.71%" for example
        tasks?: Array<{
          taskId: string;
          title: string;
          passRate: string; // "100.00%",
          comments?: Array<string>;
        }>;
      }
    | null
    | undefined;
}

function getLetterGrade(percentage: number): { letter: string; color: string } {
  // Determine letter grade
  // Example scale: A>=90, B>=80, C>=70, D>=60, F<60
  let letter = "F";
  if (percentage >= 90) {
    letter = "A";
  } else if (percentage >= 80) {
    letter = "B";
  } else if (percentage >= 70) {
    letter = "C";
  } else if (percentage >= 60) {
    letter = "D";
  }

  // Determine color for letter grade
  // (Feel free to tweak these color choices)
  let color = "error.main"; // default F => red
  switch (letter) {
    case "A":
      color = "success.main";
      break;
    case "B":
      color = "primary.main";
      break;
    case "C":
      color = "warning.main";
      break;
    case "D":
      color = "warning.light";
      break;
  }

  return { letter, color };
}

export default function AnalysisDialog({
  title,
  open,
  onClose,
  analysis,
}: AnalysisDialogProps) {
  if (!analysis) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{`${title} Analysis`}</DialogTitle>
        <DialogContent>
          <Typography>No analysis data</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { overallPassRate, tasks } = analysis;
  // Convert "85.71%" to 85.71
  const numericPassRate = overallPassRate
    ? parseFloat(overallPassRate.replace("%", ""))
    : 0;
  const { letter, color } = getLetterGrade(numericPassRate);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${title} Analysis`}</DialogTitle>
      <DialogContent>
        {/* Overall Pass Rate with Letter Grade */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Overall Pass Rate: {overallPassRate}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color }}>
            Grade: {letter}
          </Typography>
        </Box>

        {/* List of tasks */}
        {tasks && tasks.length > 0 ? (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <Box
                key={task.taskId}
                sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {task.title}
                </Typography>
                <Typography variant="body2">
                  Pass Rate: {task.passRate}
                </Typography>
                {task.comments &&
                  task.comments.filter((comment) => comment !== "").length >
                    0 && (
                    <>
                      <Typography variant="body2">Comments:</Typography>
                      <ul style={{ paddingLeft: 20 }}>
                        {task.comments &&
                          task.comments.length > 0 &&
                          task.comments.map(
                            (comment) =>
                              comment && (
                                <li key={comment}>
                                  <Typography>{comment}</Typography>
                                </li>
                              )
                          )}
                      </ul>
                    </>
                  )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography>No task data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
