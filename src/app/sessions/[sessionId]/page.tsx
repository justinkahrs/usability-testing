"use client";

import { useRouter, useParams } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default function SessionDetailsPage() {
  const { sessionId } = useParams();
  const { sessions, removeSession, removeUserTest } = useSessions();
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
      <>
        <BreadcrumbNav
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Sessions", href: "/sessions" },
            session ? { label: session.name } : { label: "Session" },
          ]}
        />
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">Session not found.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => router.push("/sessions")}>
            Go Back
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <BreadcrumbNav
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sessions", href: "/sessions" },
          { label: session.name },
        ]}
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{session.name}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {session.tasks.length} task(s)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => router.push(`/sessions/${session.id}/new-user-test`)}
          >
            Add New User Test
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                await fetch("/api/analysis", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(session),
                });
                console.log("Analysis request sent successfully!");
              } catch (err) {
                console.error("Error submitting analysis:", err);
              }
            }}
          >
            Submit for Analysis
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              // Confirm deletion
              if (
                window.confirm("Are you sure you want to delete this session?")
              ) {
                removeSession(session.id);
                router.push("/sessions");
              }
            }}
          >
            Delete Session
          </Button>
        </Stack>

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

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      router.push(`/sessions/${session.id}/${ut.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeUserTest(session.id, ut.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {session.userTests.length === 0 && (
            <Typography variant="body2">No user tests yet.</Typography>
          )}
        </Stack>
      </Box>
    </>
  );
}