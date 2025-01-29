"use client";
import { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { parseTestingTasks } from "@/utils/parseTestingTasks";

type MarkDownEditorProps = {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
};

export default function MarkDownEditor({ value, onChange, readOnly }: MarkDownEditorProps) {
  const [valid, setValid] = useState(false);
  useEffect(() => {
    const tasks = parseTestingTasks(value);
    setValid(tasks.length > 0);
  }, [value]);
  return (
    <Box display="flex" alignItems="flex-start" gap={1}>
      <TextField
        value={value}
        onChange={e => onChange(e.target.value)}
        multiline
        minRows={5}
        fullWidth
        disabled={readOnly}
      />
      {valid && <CheckCircleIcon color="success" />}
    </Box>
  );
}