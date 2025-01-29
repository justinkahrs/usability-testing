"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessions, type TestingTask } from "@/context/SessionsContext";
import { parseTestingTasks } from "@/utils/parseTestingTasks";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import MarkDownEditor from "@/components/MarkDownEditor";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export default function NewSessionPage() {
  const { addSession } = useSessions();
  const router = useRouter();
  const [mdText, setMdText] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [tasksFile, setTasksFile] = useState<File | null>(null);

  const exampleMarkdown = `
## Task 1: Locate Kaizen Workshop Information

### Scenario
You are interested in learning more about Kaizen Workshops and how they can support organizational improvement within your unit.

### Task
Navigate the website to find detailed information about Kaizen Workshops, including their purpose, format, or any upcoming sessions, and how to request this service.

### Success Criteria
User successfully uses the website navigation by going to **Services > Process Improvement > Kaizen Workshops**

---

## Task 2: ...
`;

  async function handleCreateSession() {
    if (!sessionName.trim()) return;
    let tasks: TestingTask[] = [];
    if (tasksFile) {
      const fileContent = await tasksFile.text();
      const headingMatch = fileContent.match(/^#\s+(.*)$/m);
      const nameFromMarkdown = headingMatch ? headingMatch[1].trim() : "";
      const finalSessionName = sessionName || nameFromMarkdown;
      tasks = parseTestingTasks(fileContent);
      const sessionId = addSession(finalSessionName, tasks);
      router.push(`/sessions/${sessionId}`);
    } else if (mdText.trim()) {
      tasks = parseTestingTasks(mdText);
      const sessionId = addSession(sessionName, tasks);
      router.push(`/sessions/${sessionId}`);
    }
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
      <Container component={Box} maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Session
        </Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            label="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
          <Box>
            <Button variant="outlined" component="label">
              Upload Tasks Markdown (*.md)
              <input
                type="file"
                hidden
                accept=".md"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const file = e.target.files[0];
                  const text = await file.text();
                  const headingMatch = text.match(/^#\s+(.*)$/m);
                  if (headingMatch) setSessionName(headingMatch[1].trim());
                  setTasksFile(file);
                }}
              />
            </Button>
            {tasksFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {tasksFile.name}
              </Typography>
            )}
          </Box>
          {!tasksFile && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Define Tasks Manually:
              </Typography>
              <MarkDownEditor
                value={mdText}
                onChange={(val) => setMdText(val)}
                readOnly={false}
              />
            </Box>
          )}
          {!tasksFile && (
            <>
              <Divider />
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
            </>
          )}
        </Stack>
        <Box>
          <Button
            disabled={!sessionName.trim()}
            variant="contained"
            onClick={handleCreateSession}
          >
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}