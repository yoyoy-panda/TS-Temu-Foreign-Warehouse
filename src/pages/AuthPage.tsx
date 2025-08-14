import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { mockGenerateToken, mockVerifyToken } from "../api/mockapi";
import { textFieldSx } from "../styles/commonStyles"; // 引入共用樣式

const AuthPage: React.FC = () => {
  const location = useLocation();
  const [redirectLink, setRedirectLink] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [ticket, setTicket] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get("redirectLink");
    if (link) {
      try {
        const decodedLink = decodeURIComponent(link);
        setRedirectLink(decodedLink);
        const ticketMatch = decodedLink.match(/ticket=([^&]*)/);
        if (ticketMatch && ticketMatch[1]) {
          setTicket(ticketMatch[1]);
        }
      } catch (e) {
        console.error("Error decoding redirectLink:", e);
        setMessage("無效的跳轉連結");
        setIsError(true);
      }
    } else {
      setMessage("缺少 redirectLink 參數");
      setIsError(true);
    }
  }, [location.search]);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockGenerateToken({ email, phone: countryCode + phone, ticket });
      if (response.success === "true") {
        setMessage(response.message || "驗證碼已發送，五分鐘內有效");
        setIsCodeSent(true);
      } else {
        setMessage(response.message || "發送驗證碼失敗");
        setIsError(true);
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage("請求驗證碼時發生錯誤");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockVerifyToken({
        authorizedCode: authCode,
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success === "true") {
        setMessage(response.message || "驗證成功，正在跳轉...");
        setIsCodeSent(false);
        if (redirectLink) {
          window.location.href = redirectLink;
        }
      } else {
        setMessage(response.message || "驗證碼錯誤");
        setIsError(true);
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage("驗證碼驗證時發生錯誤");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: "text.primary" }}>
        TS Temu UI 驗證
      </Typography>

      {message && (
        <Alert
          severity={isError ? "error" : "info"}
          sx={{ mb: 4, width: "100%", maxWidth: "400px" }}
        >
          {message}
        </Alert>
      )}

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: "400px",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Email Input Box"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isCodeSent}
          fullWidth
          sx={textFieldSx}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="國碼"
            variant="outlined"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            disabled={isLoading || isCodeSent}
            sx={{ width: "30%", ...textFieldSx }}
          />
          <TextField
            label="Phone Input Box"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading || isCodeSent}
            fullWidth
            sx={textFieldSx}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleGenerateCode}
          disabled={isLoading || (!email && !phone)}
          sx={{
            alignSelf: "flex-end",
            width: "fit-content",
            mt: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          startIcon={
            isLoading && !isCodeSent ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading && !isCodeSent ? "發送中..." : "要求驗證碼"}
        </Button>

        {isCodeSent && (
          <>
            <TextField
              label="驗證碼 Input Box"
              variant="outlined"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              disabled={isLoading}
              fullWidth
              sx={textFieldSx}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: -1, mb: 2 }}
            >
              驗證碼已發送至您的 Email/Phone，五分鐘內有效。
            </Typography>
          </>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <Typography variant="body1" sx={{ mr: 2, alignSelf: "center", color: "text.primary" }}>
            TextBox
          </Typography>
          <Button
            variant="contained"
            onClick={handleVerifyCode}
            disabled={isLoading || authCode.length !== 4 || !isCodeSent}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            startIcon={
              isLoading && isCodeSent ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading && isCodeSent ? "驗證中..." : "Confirm Btn"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthPage;
