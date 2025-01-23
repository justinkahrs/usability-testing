"use client";

import { useParams, useRouter } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import UserTestTaskItem from "@/components/UserTestTaskItem";
import TaskItem from "@/components/TaskItem";
import { useState, useEffect } from "react";

export default function UserTestDetailsPage() {
  const { sessionId, userTestId } = useParams();
  const router = useRouter();
  const { sessions, removeUserTest, updateUserTest } = useSessions();

  const [editing, setEditing] = useState(false);
  const [taskResults, setTaskResults] = useState<{
    [taskId: string]: { pass: boolean; comments: string };
  }>({});

  if (sessions === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading sessions...</Typography>
      </Box>
    );
  }

  const session = sessions.find((s) => s.id === sessionId);

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

  const userTest = session.userTests.find((ut) => ut.id === userTestId);

  if (!userTest) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">User Test not found.</Typography>
        <Button
          sx={{ mt: 2 }}
          onClick={() => router.push(`/sessions/${session.id}`)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Initialize local state from the existing userTest.taskResults
  useEffect(() => {
    if (userTest) {
      const init: { [taskId: string]: { pass: boolean; comments: string } } = {};
      userTest.taskResults.forEach((t) => {
        init[t.taskId] = { pass: t.pass, comments: t.comments };
      });
      setTaskResults(init);
    }
  }, [userTest]);

  function handleDelete() {
    removeUserTest(session.id, userTest.id);
    router.push(`/sessions/${session.id}`);
  }

  function handleToggle(taskId: string) {
    setTaskResults((prev) => {
      const oldVal = prev[taskId] || { pass: false, comments: "" };
      return {
        ...prev,
        [taskId]: {
          ...oldVal,
          pass: !oldVal.pass,
        },
      };
    });
  }

  function handleCommentsChange(taskId: string, comments: string) {
    setTaskResults((prev) => {
      const oldVal = prev[taskId] || { pass: false, comments: "" };
      return {
        ...prev,
        [taskId]: {
          ...oldVal,
          comments,
        },
      };
    });
  }

  function handleSave() {
    // Convert our local state into the proper array form
    const updatedResults = session.tasks.map((task) => {
      const tr = taskResults[task.id] || { pass: false, comments: "" };
      return {
        taskId: task.id,
        pass: tr.pass,
        comments: tr.comments,
      };
    });
    updateUserTest(session.id, userTest.id, updatedResults);
    setEditing(false);
  }

  return (
    <>
      <BreadcrumbNav
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sessions", href: "/sessions" },
          { label: session.name, href: `/sessions/${session.id}` },
          { label: `${userTest.firstName} ${userTest.lastName}` },
        ]}
      />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Test Details
        </Typography>
        <Stack spacing={1} mb={3}>
          <Typography variant="body1">
            <strong>Name:</strong> {userTest.firstName} {userTest.lastName}
          </Typography>
          <Typography variant="body1">
            <strong>Title:</strong> {userTest.title}
          </Typography>
          <Typography variant="body1">
            <strong>Department:</strong> {userTest.department}
          </Typography>
          <Typography variant="body1">
            <strong>Date of Test:</strong> {userTest.dateOfTest}
          </Typography>
        </Stack>

        <Typography variant="h6" gutterBottom>
          Task Results
        </Typography>

        {/* Editable vs Read-Only */}
        {!editing && (
          <Stack spacing={2}>
            {session.tasks.map((task) => {
              const tr = userTest.taskResults.find((t) => t.taskId === task.id);
              return (
                <UserTestTaskItem
                  key={task.id}
                  task={task}
                  pass={Boolean(tr?.pass)}
                  comments={tr?.comments || ""}
                />
              );
            })}
          </Stack>
        )}

        {editing && (
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
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          {!editing && (
            <Button
              variant="outlined"
              onClick={() => router.push(`/sessions/${session.id}`)}
            >
              Back
            </Button>
          )}

          {!editing && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}

          {!editing && (
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete Test
            </Button>
          )}

          {editing && (
            <>
              <Button variant="outlined" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}