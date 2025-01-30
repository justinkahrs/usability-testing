"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { SessionsProvider } from "@/context/SessionsContext";
import { LoadingProvider } from "@/context/LoadingContext";
import theme from "@/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionsProvider>{children}</SessionsProvider>
      </ThemeProvider>
    </LoadingProvider>
  );
}
