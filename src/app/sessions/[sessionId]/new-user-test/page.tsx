"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSessions, type UserTest } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TaskItem from "@/components/TaskItem";

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

  console.log({ session });
  return (
    <>
      <BreadcrumbNav
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sessions", href: "/sessions" },
          session
            ? { label: session.name, href: `/sessions/${session.id}` }
            : { label: "Session", href: "/sessions" },
          { label: "New User Test" },
        ]}
      />
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
            const current = taskResults[task.id] || {
              pass: false,
              comments: "",
            };
            return (
              <TaskItem
                key={task.id}
                task={task}
                passValue={current.pass}
                commentsValue={current.comments}
                onToggle={handleToggle}
                onCommentsChange={handleCommentsChange}
              />
            );
          })}
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={onSave}>
            Save User Test
          </Button>
        </Box>
      </Container>
    </>
  );
}
