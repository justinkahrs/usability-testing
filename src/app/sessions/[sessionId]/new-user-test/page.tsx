"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSessions, UserTest } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Stack
} from "@mui/material";
import { v4 as uuid } from "uuid";

export default function NewUserTestPage() {
  const { sessionId } = useParams();
  const { sessions, addUserTest } = useSessions();
  const router = useRouter();

  const session = sessions.find((s) => s.id === sessionId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfTest, setDateOfTest] = useState("");
  // A local state object to track pass/fail and comments for each task
  const [taskResults, setTaskResults] = useState<{
    [taskId: string]: { pass: boolean; comments: string };
  }>({});

  if (!session) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Session not found.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/sessions")}>
          Go Back
        </Button>
      </Box>
    );
  }

  function handleToggle(taskId: string) {
    setTaskResults((prev) => ({
      ...prev,
      [taskId]: {
        pass: !prev[taskId]?.pass,
        comments: prev[taskId]?.comments || "",
      },
    }));
  }

  function handleCommentsChange(taskId: string, comments: string) {
    setTaskResults((prev) => ({
      ...prev,
      [taskId]: {
        pass: prev[taskId]?.pass || false,
        comments,
      },
    }));
  }

  function onSave() {
    const userTest: UserTest = {
      id: uuid(),
      firstName,
      lastName,
      title,
      department,
      dateOfTest,
      taskResults: Object.entries(taskResults).map(([taskId, result]) => ({
        taskId,
        pass: result.pass,
        comments: result.comments,
      })),
    };
    addUserTest(sessionId, userTest);
    router.push(`/sessions/${sessionId}`);
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        New User Test for {session.name}
      </Typography>
      <Stack spacing={2} mb={3}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <TextField
          type="date"
          label="Date of Test"
          InputLabelProps={{ shrink: true }}
          value={dateOfTest}
          onChange={(e) => setDateOfTest(e.target.value)}
        />
      </Stack>

      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>
      <Stack spacing={2}>
        {session.tasks.map((task) => {
          const current = taskResults[task.id] || { pass: false, comments: "" };
          return (
            <Box
              key={task.id}
              sx={{
                border: "1px solid #ccc",
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={current.pass}
                    onChange={() => handleToggle(task.id)}
                  />
                }
                label="Pass / Fail"
              />
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Comments"
                value={current.comments}
                onChange={(e) => handleCommentsChange(task.id, e.target.value)}
              />
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={onSave}>
          Save User Test
        </Button>
      </Box>
    </Container>
  );
}