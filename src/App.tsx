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
        <div
          className="bg-cover bg-center bg-fixed "
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
          <Topbar title="" logoSrc={logoImage} />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<AuthPage />} />
            </Routes>
          </Box>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
