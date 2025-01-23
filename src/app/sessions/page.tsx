"use client";

import { useSessions } from "@/context/SessionsContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default function SessionsPage() {
  const { sessions } = useSessions();
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
      <Box sx={{ p: 2 }}>
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
              onClick={() => router.push(`/sessions/${session.id}`)}
              sx={{ cursor: "pointer", ":hover": { boxShadow: 2 } }}
            >
              <CardContent>
                <Typography variant="h6">{session.name}</Typography>
                <Typography variant="body2">
                  {session.tasks.length} tasks - {session.userTests.length} user
                  tests
                </Typography>
              </CardContent>
            </Card>
          ))}
          {sessions.length === 0 && (
            <Typography variant="body1">No sessions yet.</Typography>
          )}
        </Stack>
      </Box>
    </>
  );
}