"use client";

import { useSessions } from "@/context/SessionsContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SessionAnalysisActions from "@/components/SessionAnalysisActions";

export default function SessionsPage() {
  const {
    sessions,
    removeSession,
    removeSessionAnalysis,
    updateSessionAnalysis,
  } = useSessions();
  const router = useRouter();

  if (sessions === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading sessions...</Typography>
      </Box>
    );
  }

  return (
    <>
      <BreadcrumbNav
        crumbs={[{ label: "Home", href: "/" }, { label: "Sessions" }]}
      />
      <Container component={Box} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Sessions
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/sessions/new")}
        >
          Create New Session
        </Button>

        <Stack spacing={2} mt={4}>
          {sessions.map((session) => (
            <Card
              key={session.id}
              variant="outlined"
              sx={{ ":hover": { boxShadow: 2 } }}
            >
              <CardContent>
                <Typography variant="h6">{session.name}</Typography>
                <Typography variant="body2">
                  {session.tasks.length} tasks - {session.userTests.length} user
                  tests
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    View
                  </Button>
                  <SessionAnalysisActions
                    session={session}
                    removeSession={removeSession}
                    removeSessionAnalysis={removeSessionAnalysis}
                    updateSessionAnalysis={updateSessionAnalysis}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
          {sessions.length === 0 && (
            <Typography variant="body1">No sessions yet.</Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}
