"use client";

import { useSessions } from "@/context/SessionsContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SessionCard from "@/components/SessionCard";

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
            <SessionCard
              key={session.id}
              session={session}
              removeSession={removeSession}
              removeSessionAnalysis={removeSessionAnalysis}
              updateSessionAnalysis={updateSessionAnalysis}
              onView={(id) => router.push(`/sessions/${id}`)}
            />
          ))}
          {sessions.length === 0 && (
            <Typography variant="body1">No sessions yet.</Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}