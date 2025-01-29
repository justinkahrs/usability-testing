"use client";

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";

interface RichTextInputProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label?: string;
}

export default function RichTextInput({
  value,
  onChange,
  readOnly = false,
  label,
}: RichTextInputProps) {
  const modules = {
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "clean"],
        ],
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        modules={modules}
      />
    </Box>
  );
}
