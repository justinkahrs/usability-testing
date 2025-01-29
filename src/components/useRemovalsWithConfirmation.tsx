import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useSessions } from "../context/SessionsContext";

export function useRemovalsWithConfirmation() {
  const { removeSession, removeUserTest, removeSessionAnalysis } = useSessions();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  const confirmRemoveSession = (sessionId: string) => {
    setDialogState({
      open: true,
      title: "Remove Session",
      message: "Are you sure you want to remove this session?",
      onConfirm: () => {
        removeSession(sessionId);
        setDialogState((s) => ({ ...s, open: false }));
      }
    });
  };

  const confirmRemoveUserTest = (sessionId: string, userTestId: string) => {
    setDialogState({
      open: true,
      title: "Remove User Test",
      message: "Are you sure you want to remove this user test?",
      onConfirm: () => {
        removeUserTest(sessionId, userTestId);
        setDialogState((s) => ({ ...s, open: false }));
      }
    });
  };

  const confirmRemoveSessionAnalysis = (sessionId: string) => {
    setDialogState({
      open: true,
      title: "Remove Analysis",
      message: "Are you sure you want to remove this analysis?",
      onConfirm: () => {
        removeSessionAnalysis(sessionId);
        setDialogState((s) => ({ ...s, open: false }));
      }
    });
  };

  const ConfirmationUI = (
    <ConfirmationDialog
      open={dialogState.open}
      onClose={() => setDialogState((s) => ({ ...s, open: false }))}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
    />
  );

  return {
    confirmRemoveSession,
    confirmRemoveUserTest,
    confirmRemoveSessionAnalysis,
    ConfirmationUI
  };
}