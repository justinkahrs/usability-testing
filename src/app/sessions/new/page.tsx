"use client";

import { useState } from "react";
// import TurndownService from "turndown";
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
# PMO Usability Testing Tasks

## Task 1: Locate Kaizen Workshop Information

### Scenario
You are interested in learning more about Kaizen Workshops and how they can support organizational improvement within your unit.

### Task
Navigate the website to find detailed information about Kaizen Workshops, including their purpose, format, or any upcoming sessions, and how to request this service.

### Success Criteria
User successfully uses the website navigation by going to **Services > Process Improvement > Kaizen Workshops**
`;

  async function handleCreateSession() {
    if (!sessionName.trim()) return;
    let tasks: TestingTask[] = [];
    if (tasksFile) {
      const fileContent = await tasksFile.text();
      const headingMatch = fileContent.match(/^#\s+(.*)$/m);
      const nameFromMarkdown = headingMatch ? headingMatch[1].trim() : "";
      const finalSessionName = nameFromMarkdown || sessionName;
      tasks = parseTestingTasks(fileContent);
      addSession(finalSessionName, tasks);
      router.push("/sessions");
    } else if (mdText.trim()) {
      tasks = parseTestingTasks(mdText);
      addSession(sessionName, tasks);
      router.push("/sessions");
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
        </Stack>
        <Box>
          <Button variant="contained" onClick={handleCreateSession}>
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}
