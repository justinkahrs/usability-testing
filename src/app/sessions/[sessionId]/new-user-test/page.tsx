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
import RichTextInput from "@/components/RichTextInput";
import TaskCarousel from "@/components/TaskCarousel";

export default function NewUserTestPage() {
  const [firstName, setFirstName] = useState("");
  const [generalComments, setGeneralComments] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfTest, setDateOfTest] = useState("");
  const [taskResults, setTaskResults] = useState<{
    [taskId: string]: { pass: boolean; comments: string };
  }>({});

  // New state for toggling view mode and tracking "all tasks viewed" in carousel mode
  const [viewMode, setViewMode] = useState<"list" | "carousel">("carousel");
  const [allTasksViewed, setAllTasksViewed] = useState(true);

  const { sessionId } = useParams();
  const { sessions, addUserTest } = useSessions();
  const router = useRouter();

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
      taskResults: session.tasks.map((task) => {
        const tr = taskResults[task.id] || { pass: false, comments: "" };
        return {
          taskId: task.id,
          pass: tr.pass,
          comments: tr.comments,
        };
      }),
      generalComments,
    };
    addUserTest(sessionId, userTest);
    router.push(`/sessions/${sessionId}`);
  }

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
            <div>
              {/* Use the new TaskCarousel component */}
              <TaskCarousel
                tasks={session.tasks}
                taskResults={taskResults}
                onToggle={handleToggle}
                onCommentsChange={handleCommentsChange}
                onAllViewedChange={setAllTasksViewed}
              />
            </div>
          </Stack>
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          General Comments
        </Typography>
        <RichTextInput
          value={generalComments}
          onChange={(val) => setGeneralComments(val)}
          readOnly={false}
        />
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={onSave}
            disabled={viewMode === "carousel" && !allTasksViewed}
          >
            Save User Test
          </Button>
        </Box>
      </Container>
    </>
  );
}
