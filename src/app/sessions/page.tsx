"use client";

import { useState } from "react";
import { useSessions } from "@/context/SessionsContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import AnalysisDialog from "@/components/AnalysisDialog";

export default function SessionsPage() {
  const {
    sessions,
    removeSession,
    removeSessionAnalysis,
    updateSessionAnalysis,
  } = useSessions();
  const router = useRouter();
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analysisToShow, setAnalysisToShow] = useState<any>(null);

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
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      try {
                        const { analysis, ...sessionToSend } = session;
                        const { data } = await axios.post(
                          "/api/analysis",
                          sessionToSend,
                          {
                            headers: { "Content-Type": "application/json" },
                          }
                        );
                        updateSessionAnalysis(session.id, data);
                      } catch (err) {
                        console.error("Error submitting analysis:", err);
                      }
                    }}
                  >
                    {session.analysis
                      ? "Resubmit for Analysis"
                      : "Submit for Analysis"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setAnalysisToShow(session.analysis);
                      setAnalysisDialogOpen(true);
                    }}
                  >
                    View Analysis
                  </Button>
                  {session.analysis && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete the analysis?"
                          )
                        ) {
                          removeSessionAnalysis(session.id);
                        }
                      }}
                    >
                      Delete Analysis
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this session?"
                        )
                      ) {
                        removeSession(session.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {sessions.length === 0 && (
            <Typography variant="body1">No sessions yet.</Typography>
          )}
        </Stack>
      </Box>
      <AnalysisDialog
        open={analysisDialogOpen}
        onClose={() => setAnalysisDialogOpen(false)}
        analysis={analysisToShow}
      />
    </>
  );
}
