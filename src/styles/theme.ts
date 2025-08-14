import { createTheme, useMediaQuery } from "@mui/material";
import React from "react";

export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          ...(prefersDarkMode
            ? {
                // 深色模式調色板
                primary: {
                  main: "#90caf9", // 淺藍色
                },
                secondary: {
                  main: "#f48fb1", // 淺粉色
                },
                background: {
                  default: "#121212", // 深色背景
                  paper: "#1e1e1e", // 深色紙張背景
                },
                text: {
                  primary: "#ffffff", // 白色文字
                  secondary: "#aaaaaa", // 灰色文字
                },
              }
            : {
                // 淺色模式調色板
                primary: {
                  main: "#1976d2", // 深藍色
                },
                secondary: {
                  main: "#dc004e", // 深粉色
                },
                background: {
                  default: "#f5f5f5", // 淺色背景
                  paper: "#ffffff", // 白色紙張背景
                },
                text: {
                  primary: "#000000", // 黑色文字
                  secondary: "#555555", // 灰色文字
                },
              }),
        },
      }),
    [prefersDarkMode]
  );

  return theme;
};
