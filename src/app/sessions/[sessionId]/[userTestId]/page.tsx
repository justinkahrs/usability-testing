"use client";

import { useParams, useRouter } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";

import BreadcrumbNav from "@/components/BreadcrumbNav";
import UserTestTaskItem from "@/components/UserTestTaskItem";
import TaskItem from "@/components/TaskItem";
import RichTextInput from "@/components/RichTextInput";
import TaskCarousel from "@/components/TaskCarousel";
import type { UserTest } from "@/context/SessionsContext";

export default function UserTestDetailsPage() {
  const { sessionId, userTestId } = useParams();
  const router = useRouter();
  const { sessions, removeUserTest, updateUserTest } = useSessions();

  const [editing, setEditing] = useState(false);
  const [taskResults, setTaskResults] = useState<{
    [taskId: string]: { pass: boolean; comments: string };
  }>({});
  const [generalComments, setGeneralComments] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "carousel">("list");
  const [, setAllTasksViewed] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfTest, setDateOfTest] = useState("");

  const session = sessions?.find((s) => s.id === sessionId);
  const userTest = session?.userTests?.find((ut) => ut.id === userTestId);

  const userTestTaskResults = useMemo(() => {
    return Array.isArray(userTest?.taskResults) ? userTest.taskResults : [];
  }, [userTest?.taskResults]);

  useEffect(() => {
    if (!userTest) return;

    setFirstName(userTest.firstName || "");
    setLastName(userTest.lastName || "");
    setTitle(userTest.title || "");
    setDepartment(userTest.department || "");
    setDateOfTest(userTest.dateOfTest || "");
    setGeneralComments(userTest.generalComments || "");

    const init: { [taskId: string]: { pass: boolean; comments: string } } = {};
    for (const t of userTestTaskResults) {
      init[t.taskId] = { pass: t.pass, comments: t.comments };
    }
    setTaskResults(init);
  }, [userTest, userTestTaskResults]);

  if (sessions === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading sessions...</Typography>
      </Box>
    );
  }

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

  function handleDelete() {
    if (session && userTest) {
      removeUserTest(session.id, userTest.id);
      router.push(`/sessions/${session.id}`);
    }
  }

  function handleToggle(taskId: string) {
    setTaskResults((prev) => {
      const oldVal = prev[taskId] || { pass: false, comments: "" };
      return {
        ...prev,
        [taskId]: { ...oldVal, pass: !oldVal.pass },
      };
    });
  }

  function handleCommentsChange(taskId: string, comments: string) {
    setTaskResults((prev) => {
      const oldVal = prev[taskId] || { pass: false, comments: "" };
      return {
        ...prev,
        [taskId]: { ...oldVal, comments },
      };
    });
  }

  function handleSave() {
    // Convert our local state into the proper array form
    const updatedResults: Array<{
      taskId: string;
      pass: boolean;
      comments: string;
    }> = session
      ? session.tasks.map((task) => {
          const tr = taskResults[task.id] || { pass: false, comments: "" };
          return {
            taskId: task.id,
            pass: tr.pass,
            comments: tr.comments,
          };
        })
      : [];

    const updatedUserTest: UserTest = {
      ...(userTest || {}), // Provide a default empty object if userTest is undefined
      id: userTest?.id || "", // Ensure id is a string
      firstName,
      lastName,
      title,
      department,
      dateOfTest,
      taskResults: updatedResults,
      generalComments,
    };

    if (session && userTest) {
      updateUserTest(session.id, userTest.id, updatedUserTest);
    }
    setEditing(false);
  }

  // We can define a small sub-component for the action buttons:
  function ActionButtons() {
    return (
      <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
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
    );
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
        <ActionButtons />

        <Typography variant="h5" gutterBottom>
          User Test Details
        </Typography>

        {/* Display user info */}
        {!editing ? (
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
        ) : (
          <Stack spacing={2} mb={3}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              label="Date of Test"
              InputLabelProps={{ shrink: true }}
              value={dateOfTest}
              onChange={(e) => setDateOfTest(e.target.value)}
              fullWidth
            />
          </Stack>
        )}

        {/* Task Results */}
        <Typography variant="h6" gutterBottom>
          Task Results
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography>View tasks as:</Typography>
          <Button
            variant={viewMode === "carousel" ? "contained" : "outlined"}
            onClick={() => {
              setViewMode("carousel");
              setAllTasksViewed(false);
            }}
          >
            Carousel
          </Button>
          <Button
            variant={viewMode === "list" ? "contained" : "outlined"}
            onClick={() => {
              setViewMode("list");
              setAllTasksViewed(true);
            }}
          >
            List
          </Button>
        </Stack>

        {viewMode === "list" && (
          <Stack spacing={2}>
            {session.tasks.map((task) => {
              if (!editing) {
                const tr = userTestTaskResults.find(
                  (t) => t.taskId === task.id
                );
                return (
                  <UserTestTaskItem
                    key={task.id}
                    task={task}
                    pass={Boolean(tr?.pass)}
                    comments={tr?.comments || ""}
                  />
                );
              }
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

        {viewMode === "carousel" && (
          <Stack spacing={2}>
            <TaskCarousel
              tasks={session.tasks}
              taskResults={taskResults}
              onToggle={handleToggle}
              onCommentsChange={handleCommentsChange}
              onAllViewedChange={setAllTasksViewed}
              readOnly={!editing}
            />
          </Stack>
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          General Comments
        </Typography>
        {!editing ? (
          <RichTextInput value={userTest.generalComments || ""} readOnly />
        ) : (
          <RichTextInput
            value={generalComments}
            onChange={(val) => setGeneralComments(val)}
          />
        )}
        <ActionButtons />
      </Container>
    </>
  );
}
