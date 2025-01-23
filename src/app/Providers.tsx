"use client";

import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SessionsProvider } from "@/context/SessionsContext";
import theme from "@/theme";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionsProvider>{children}</SessionsProvider>
    </ThemeProvider>
  );
}
