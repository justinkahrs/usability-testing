"use client";

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";

interface RichTextInputProps {
  height?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label?: string;
}

export default function RichTextInput({
  value,
  onChange,
  height = "150px",
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
      <Box style={{ height }}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          modules={modules}
          style={{
            height,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        />
      </Box>
    </Box>
  );
}
