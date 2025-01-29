import { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import type { Session } from "@/context/SessionsContext";
import AnalysisDialog from "./AnalysisDialog";
import ConfirmationDialog from "./ConfirmationDialog";

type Props = {
  session: Session;
  removeSession: (sessionId: string) => void;
  removeSessionAnalysis: (sessionId: string) => void;
  updateSessionAnalysis: (sessionId: string, analysis: any) => void;
};

export default function SessionAnalysisActions({
  session,
  removeSession,
  removeSessionAnalysis,
  updateSessionAnalysis
}: Props) {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    onConfirm: () => {}
  });
  const [open, setOpen] = useState(false);

  async function handleAnalysis() {
    try {
      const { analysis, ...sessionToSend } = session;
      const {
        data: { responseData },
      } = await axios.post("/api/analysis", sessionToSend, {
        headers: { "Content-Type": "application/json" },
      });
      updateSessionAnalysis(session.id, responseData);
      setOpen(true);
    } catch (_) {}
  }

  function handleDeleteAnalysis() {
  setConfirmDialog({
    open: true,
    message: "Are you sure you want to delete the analysis?",
    onConfirm: () => {
      removeSessionAnalysis(session.id);
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  });
}

  function handleDeleteSession() {
  setConfirmDialog({
    open: true,
    message: "Are you sure you want to delete this session?",
    onConfirm: () => {
      removeSession(session.id);
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  });
}

  return (
    <>
      <Button variant="outlined" onClick={handleAnalysis}>
        {session.analysis ? "Resubmit for Analysis" : "Submit for Analysis"}
      </Button>
      {session.analysis && Object.keys(session.analysis).length > 0 && (
        <>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            View Analysis
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleDeleteAnalysis}
          >
            Delete Analysis
          </Button>
        </>
      )}
      <Button variant="outlined" color="error" onClick={handleDeleteSession}>
        Delete Session
      </Button>
      <AnalysisDialog
        open={open}
        onClose={() => setOpen(false)}
        analysis={session.analysis}
      />
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmDialog.onConfirm}
        message={confirmDialog.message}
      />
    </>
  );
}