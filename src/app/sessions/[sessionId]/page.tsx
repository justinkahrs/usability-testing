"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSessions } from "@/context/SessionsContext";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SessionAnalysisActions from "@/components/SessionAnalysisActions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SessionTasksAccordion from "@/components/SessionTasksAccordion";
import UserTestCard from "@/components/UserTestCard";

export default function SessionDetailsPage() {
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userTestToDelete, setUserTestToDelete] = useState<string | null>(null);
  const [openUserTestConfirm, setOpenUserTestConfirm] = useState(false);
  const { sessionId } = useParams();
  const {
    sessions,
    removeSession,
    removeSessionAnalysis,
    removeUserTest,
    updateSessionAnalysis,
  } = useSessions();
  const router = useRouter();

  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <>
        <BreadcrumbNav
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Sessions", href: "/sessions" },
            { label: "Session" },
          ]}
        />
        <Box component="div" marginTop={2}>
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
      <Container component={Box} sx={{ p: 2 }}>
        <Typography variant="h4">{session.name}</Typography>
        <Stack direction="row" spacing={2} marginBottom={3} alignItems="center">
          <Button
            variant="contained"
            onClick={() => router.push(`/sessions/${session.id}/new-user-test`)}
          >
            Add New User Test
          </Button>

          <SessionAnalysisActions
            session={session}
            removeSession={removeSession}
            removeSessionAnalysis={(id) => {
              setAnalysisToDelete(id);
              setOpenConfirm(true);
            }}
            updateSessionAnalysis={updateSessionAnalysis}
          />
        </Stack>
        <Stack sx={{ mb: 2 }}>
          <SessionTasksAccordion tasks={session.tasks} />
        </Stack>
        <Typography sx={{ mb: 2 }} variant="h5">
          {`(${session.userTests.length})`} Testers
        </Typography>
        <Stack spacing={2}>
          {session.userTests.map((ut) => (
            <UserTestCard
              key={ut.id}
              sessionId={session.id}
              userTest={ut}
              totalTasks={session.tasks.filter((t) => t.successCriteria).length}
              onView={(sid, utid) => router.push(`/sessions/${sid}/${utid}`)}
              onDelete={(utid) => {
                setUserTestToDelete(utid);
                setOpenUserTestConfirm(true);
              }}
            />
          ))}
          {session.userTests.length === 0 && (
            <Typography variant="body2">No user tests yet.</Typography>
          )}
        </Stack>
      </Container>
      <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          if (analysisToDelete) {
            removeSessionAnalysis(analysisToDelete);
            setAnalysisToDelete(null);
          }
          setOpenConfirm(false);
        }}
        title="Delete Analysis"
        message="Are you sure you want to delete the analysis?"
      />
      <ConfirmationDialog
        open={openUserTestConfirm}
        onClose={() => setOpenUserTestConfirm(false)}
        onConfirm={() => {
          if (userTestToDelete) {
            removeUserTest(session.id, userTestToDelete);
            setUserTestToDelete(null);
          }
          setOpenUserTestConfirm(false);
        }}
        title="Delete User Test"
        message="Are you sure you want to delete this user test?"
      />
    </>
  );
}
