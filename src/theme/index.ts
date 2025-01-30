import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          ".slide-left-enter": {
            transform: "translateX(100%)",
          },
          ".slide-left-enter-active": {
            transform: "translateX(0)",
            transition: "transform 300ms ease-out",
          },
          ".slide-left-exit": {
            transform: "translateX(0)",
          },
          ".slide-left-exit-active": {
            transform: "translateX(-100%)",
            transition: "transform 300ms ease-out",
          },
          ".slide-right-enter": {
            transform: "translateX(-100%)",
          },
          ".slide-right-enter-active": {
            transform: "translateX(0)",
            transition: "transform 300ms ease-out",
          },
          ".slide-right-exit": {
            transform: "translateX(0)",
          },
          ".slide-right-exit-active": {
            transform: "translateX(100%)",
            transition: "transform 300ms ease-out",
          },
        },
      },
    },
    MuiContainer: {
      variants: [
        {
          props: {},
          style: ({ theme }) => ({
            padding: theme.spacing(2),
          }),
        },
      ],
    },
  },
});

export default theme;
