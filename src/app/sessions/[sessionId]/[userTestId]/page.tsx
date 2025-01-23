"use client";

import { useParams, useRouter } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import UserTestTaskItem from "@/components/UserTestTaskItem";

export default function UserTestDetailsPage() {
  const { sessionId, userTestId } = useParams();
  const router = useRouter();
  const { sessions, removeUserTest } = useSessions();

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

  function handleDelete() {
    removeUserTest(session.id, userTest.id);
    router.push(`/sessions/${session.id}`);
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
          userTest
            ? { label: `${userTest.firstName} ${userTest.lastName}` }
            : { label: "User Test" },
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

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(`/sessions/${session.id}`)}
          >
            Back
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Test
          </Button>
        </Stack>
      </Container>
    </>
  );
}
