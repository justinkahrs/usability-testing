"use client";

import { useRouter, useParams } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack
} from "@mui/material";

export default function SessionDetailsPage() {
  const { sessionId } = useParams();
  const { sessions } = useSessions();
  const router = useRouter();

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">{session.name}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {session.tasks.length} task(s)
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push(`/sessions/${session.id}/new-user-test`)}
      >
        Add New User Test
      </Button>

      <Stack spacing={2}>
        {session.userTests.map((ut) => (
          <Card key={ut.id}>
            <CardContent>
              <Typography variant="h6">
                {ut.firstName} {ut.lastName}
              </Typography>
              <Typography variant="body2">
                {ut.title} - {ut.department}
              </Typography>
              <Typography variant="body2">
                Tested on: {ut.dateOfTest}
              </Typography>
              <Typography variant="body2">
                {ut.taskResults.filter((t) => t.pass).length} /{" "}
                {session.tasks.length} passed
              </Typography>
            </CardContent>
          </Card>
        ))}
        {session.userTests.length === 0 && (
          <Typography variant="body2">No user tests yet.</Typography>
        )}
      </Stack>
    </Box>
  );
}