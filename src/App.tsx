import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useAppTheme } from "./styles/theme";

function App() {
  const theme = useAppTheme(); // 使用自定義的 useAppTheme hook

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 用於重置 CSS 並應用主題背景色 */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
