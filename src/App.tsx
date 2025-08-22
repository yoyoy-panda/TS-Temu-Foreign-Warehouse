import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useAppTheme } from "./styles/theme";
import Topbar from "./components/Topbar";
import logoImage from "./assets/TSLogo.png";
//import backgroundImage from "./assets/doggy.png";
import backgroundImage from "./assets/shelves.jpg";

function App() {
  const theme = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          className="bg-cover bg-center bg-fixed "
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundRepeat: "no-repeat", // 防止圖片重複
            backgroundSize: "cover", // 保持比例並覆蓋整個容器
            backgroundPosition: "center center", // 圖片居中顯示
            backgroundAttachment: "fixed", // 背景固定不動，不隨滾動條滾動，
          }}
        >
          <Topbar logoSrc={logoImage} />
          <Routes>
            <Route path="/" element={<AuthPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
