import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: [
      // Keep the Geist fonts if desired, or override with MUI defaults
      "var(--font-geist-sans)",
      "var(--font-geist-mono)",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default theme;