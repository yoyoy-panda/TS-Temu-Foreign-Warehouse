import { createTheme, useMediaQuery } from "@mui/material";
import React from "react";

const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Light mode color tokens
const light_text_color = "#000000";
const light_bg_color = "#fefefe";
const light_bg_color2 = "#fcfcfc";
const light_bg_color3 = "#f0f0f0";
const light_placeholder_color = "#606060";
const light_border_color = "#bbbbbb";
const light_hover_color = "#dddddd";

// Dark mode color tokens
const dark_text_color = "#ffffff";
const dark_bg_color = "#242424";
const dark_bg_color2 = "#363636";
const dark_bg_color3 = "#484848";
const dark_placeholder_color = "#cccccc";
const dark_border_color = "#bbbbbb";
const dark_hover_color = "#727272";

const lightTheme = createTheme({
  breakpoints,
  palette: {
    mode: "light",
    primary: {
      main: "#1177dd",
    },
    secondary: {
      main: "#dd0044",
    },
    background: {
      default: light_bg_color,
      paper: light_bg_color2,
    },
    text: {
      primary: light_text_color,
      secondary: light_placeholder_color,
    },
    action: {
      hover: light_hover_color,
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: light_hover_color,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          backgroundColor: light_bg_color2,
          color: light_text_color,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: light_hover_color,
          },
        },
        input: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          color: light_text_color,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          color: light_placeholder_color,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  breakpoints,
  palette: {
    mode: "dark",
    primary: {
      main: "#446699",
    },
    secondary: {
      main: "#5588bb",
    },
    background: {
      default: dark_bg_color,
      paper: dark_bg_color2,
    },
    text: {
      primary: dark_text_color,
      secondary: dark_placeholder_color,
      disabled: dark_placeholder_color,
    },
    action: {
      hover: dark_hover_color,
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          "&:hover": {
            backgroundColor: dark_hover_color,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          backgroundColor: dark_bg_color2,
          color: dark_text_color,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: dark_hover_color,
          },
        },
        input: {
          transition:
            "background-color 0.5s ease, color 0.5s ease, border 0.5s ease",
          color: dark_text_color,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transition: "background-color 0.5s ease, color 0.5s ease",
          color: dark_placeholder_color,
        },
      },
    },
  },
});

export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return prefersDarkMode ? darkTheme : lightTheme;
};
