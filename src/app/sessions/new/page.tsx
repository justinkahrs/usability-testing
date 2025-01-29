"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useSessions, type TestingTask } from "@/context/SessionsContext";
import { parseTestingTasks } from "@/utils/parseTestingTasks";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ManualTask {
  id: string;
  title: string;
  scenario: string;
  instructions: string;
  successCriteria: string;
}

export default function NewSessionPage() {
  const { addSession } = useSessions();
  const router = useRouter();

  const [sessionName, setSessionName] = useState("");
  const [tasksFile, setTasksFile] = useState<File | null>(null);

  // State for manual tasks
  const [showManualTaskForm, setShowManualTaskForm] = useState(false);
  const [manualTasks, setManualTasks] = useState<ManualTask[]>([]);

  // Example snippet for user reference
  const exampleMarkdown = `
# PMO Usability Testing Tasks

## Task 1: Locate Kaizen Workshop Information

### Scenario
You are interested in learning more about Kaizen Workshops and how they can support organizational improvement within your unit.

### Task
Navigate the website to find detailed information about Kaizen Workshops, including their purpose, format, or any upcoming sessions, and how to request this service.

### Success Criteria
User successfully uses the website navigation by going to **Services > Process Improvement > Kaizen Workshops**

---

## Task 2: Access the Strategy and Program Design Service Page

### Scenario
You are an organizational leader looking for services that help address complex challenges by diagnosing issues and creating long-term plans.

### Task
Find the section where you can learn about diagnosing organizational challenges and creating strategic plans or programs.

### Success Criteria
User navigates to **Strategy and Program Design** by going to **Services > Strategy and Program Design card**
`;

  // Handle session creation
  async function handleCreateSession() {
    if (!sessionName.trim()) return;

    let tasks: TestingTask[] = [];
    // If a file is uploaded, parse it
    if (tasksFile) {
      const fileContent = await tasksFile.text();
      tasks = parseTestingTasks(fileContent);
    }
    // Otherwise, if tasks were manually generated, parse their generated markdown
    else if (manualTasks.length > 0) {
      const fileContent = generateMarkdown();
      tasks = parseTestingTasks(fileContent);
    }

    addSession(sessionName, tasks);
    router.push("/sessions");
  }

  // Handle manual tasks
  function addManualTaskItem() {
    setManualTasks((prev) => [
      ...prev,
      {
        id: uuid(),
        title: "",
        scenario: "",
        instructions: "",
        successCriteria: "",
      },
    ]);
  }

  function removeManualTaskItem(id: string) {
    setManualTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handleTaskFieldChange(
    id: string,
    field: keyof ManualTask,
    value: string
  ) {
    setManualTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  // Generate markdown from manual task entries
  function generateMarkdown() {
    return manualTasks
      .map((t, idx) => {
        const taskNum = idx + 1;
        return `## Task ${taskNum}: ${t.title || "Untitled Task"}

**Scenario:**
${t.scenario || ""}

**Task:**
${t.instructions || ""}

**Success Criteria:**
${t.successCriteria || ""}

`;
      })
      .join("\n");
  }

  return (
    <>
      <BreadcrumbNav
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sessions", href: "/sessions" },
          { label: "New Session" },
        ]}
      />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Session
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {/* Session Name Field */}
          <TextField
            label="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />

          {/* File Upload */}
          <Box>
            <Button variant="outlined" component="label">
              Upload Tasks Markdown (*.md)
              <input
                type="file"
                hidden
                accept=".md"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setTasksFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {tasksFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {tasksFile.name}
              </Typography>
            )}
          </Box>

          {/* Example Markdown */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Example Markdown Format:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                backgroundColor: "grey.100",
                overflow: "auto",
                fontSize: "0.875rem",
              }}
            >
              {exampleMarkdown}
            </Box>
          </Box>

          <Divider />

          {/* Manual Task Form */}
          <Box>
            <Button
              variant="outlined"
              onClick={() => setShowManualTaskForm((prev) => !prev)}
              sx={{ display: "none" }} // TO-DO, take generated markdown and feed into create flow
            >
              {showManualTaskForm
                ? "Hide Manual Task Form"
                : "Generate Markdown"}
            </Button>
          </Box>

          {showManualTaskForm && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Define Tasks Manually:
              </Typography>

              <Stack spacing={2}>
                {manualTasks.map((task, index) => (
                  <Box
                    key={task.id}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={2}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Task {index + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeManualTaskItem(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                    <Stack spacing={2}>
                      <TextField
                        label="Title"
                        value={task.title}
                        onChange={(e) =>
                          handleTaskFieldChange(
                            task.id,
                            "title",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Scenario"
                        multiline
                        rows={2}
                        value={task.scenario}
                        onChange={(e) =>
                          handleTaskFieldChange(
                            task.id,
                            "scenario",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Task"
                        multiline
                        rows={2}
                        value={task.instructions}
                        onChange={(e) =>
                          handleTaskFieldChange(
                            task.id,
                            "instructions",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Success Criteria"
                        multiline
                        rows={2}
                        value={task.successCriteria}
                        onChange={(e) =>
                          handleTaskFieldChange(
                            task.id,
                            "successCriteria",
                            e.target.value
                          )
                        }
                      />
                    </Stack>
                  </Box>
                ))}

                <Button variant="outlined" onClick={addManualTaskItem}>
                  Add Task
                </Button>

                {/* Preview of generated markdown */}
                {manualTasks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Generated Markdown Preview:
                    </Typography>
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={generateMarkdown()}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>

        {/* Final "Create" Button */}
        <Box>
          <Button variant="contained" onClick={handleCreateSession}>
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}