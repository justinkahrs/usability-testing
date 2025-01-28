"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface AnalysisDialogProps {
  open: boolean;
  onClose: () => void;
  analysis: any;
}

export default function AnalysisDialog({ open, onClose, analysis }: AnalysisDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Analysis</DialogTitle>
      <DialogContent>
        {analysis ? (
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        ) : (
          "No analysis data"
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}