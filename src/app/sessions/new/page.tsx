"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessions, TestingTask } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack
} from "@mui/material";

export default function NewSessionPage() {
  const { addSession } = useSessions();
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [tasksFile, setTasksFile] = useState<File | null>(null);

  function parseMarkdown(content: string): TestingTask[] {
    // Basic example of turning each line into a task
    // In real usage, parse more robustly or use a library
    const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.map((description) => ({
      id: crypto.randomUUID(),
      description,
    }));
  }

  async function handleCreateSession() {
    if (!sessionName) return;
    let tasks: TestingTask[] = [];
    if (tasksFile) {
      const fileContent = await tasksFile.text();
      tasks = parseMarkdown(fileContent);
    }
    addSession(sessionName, tasks);
    router.push("/sessions");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Session
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Session Name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
        <Button variant="outlined" component="label">
          Upload Tasks Markdown
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
          <Typography variant="body2" color="text.secondary">
            {tasksFile.name}
          </Typography>
        )}

        <Box>
          <Button variant="contained" onClick={handleCreateSession}>
            Create
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}