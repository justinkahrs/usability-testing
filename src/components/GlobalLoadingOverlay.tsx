"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import { useLoading } from "@/context/LoadingContext";

export default function GlobalLoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <Backdrop
      open={isLoading}
      sx={{
        color: "#fff",
        zIndex: theme => theme.zIndex.drawer + 9999,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}