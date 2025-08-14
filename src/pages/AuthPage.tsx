import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete, // 導入 Autocomplete
} from "@mui/material";

import { mockGenerateToken, mockVerifyToken } from "../api/MockApi";
import { textFieldSx } from "../styles/commonStyles"; // 引入共用樣式
import { useTranslation } from "react-i18next"; // 引入 useTranslation
import countryData from "../assets/contrycode.json"; // 導入國家代碼資料

interface CountryOption {
  name: string;
  dial_code: string;
  code: string;
}

const LOCKDOWN_TIMER = 300;

const AuthPage: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation(); // 初始化 useTranslation
  const [redirectLink, setRedirectLink] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null); // 新增 email 錯誤訊息 state
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [ticket, setTicket] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(0); // 新增倒數計時 state

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
        setMessage(t("authPage.invalidRedirectLink"));
        setIsError(true);
      }
    } else {
      setMessage(t("authPage.missingRedirectLink"));
      setIsError(true);
    }
  }, [location.search, t]); // 添加 t 到依賴陣列

  useEffect(() => {
    let timer: number;
    if (isCodeSent && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isCodeSent) {
      // 倒數結束且驗證碼已發送，表示需要重新發送
      setIsCodeSent(false); // 禁用下一步按鈕，並重新啟用輸入欄位
      setMessage(t("authPage.codeExpired")); // 顯示驗證碼過期訊息
      setIsError(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCodeSent, t]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email Regex

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !emailRegex.test(newEmail)) {
      setEmailError(t("authPage.invalidEmailFormat"));
    } else {
      setEmailError(null);
    }
  };

  const handleGenerateCode = async () => {
    if (!emailRegex.test(email)) {
      setEmailError(t("authPage.invalidEmailFormat"));
      return;
    }

    console.log(email, countryCode + phone, ticket);
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockGenerateToken({
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success === "true") {
        setMessage(response.message || t("authPage.codeSentSuccess"));
        setIsCodeSent(true);
        setCountdown(LOCKDOWN_TIMER); // 成功發送驗證碼後，設定倒數計時為 300 秒
      } else {
        setMessage(response.message || t("authPage.sendCodeFailed"));
        setIsError(true);
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage(t("authPage.requestError"));
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
        setMessage(response.message || t("authPage.verifySuccess"));
        setIsCodeSent(false);
        if (redirectLink) {
          window.location.href = redirectLink;
        }
      } else {
        setMessage(response.message || t("authPage.verifyCodeError"));
        setIsError(true);
        setIsCodeSent(false); // 驗證碼錯誤時，重新開啟 email, 國碼, 手機號碼欄位
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage(t("authPage.verifyError"));
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
        justifyContent: "start",
        minHeight: "100dvh",
        padding: 4,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "text.primary" }}
      >
        {t("authPage.title")}
      </Typography>

      {message && (
        <Alert
          severity={isError ? "error" : "info"}
          sx={{ mb: 4, width: "100%", maxWidth: "500px" }}
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
          maxWidth: "500px",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label={t("authPage.emailLabel")}
          placeholder={t("authPage.emailPlaceHolder")}
          variant="outlined"
          value={email}
          onChange={handleEmailChange} // 使用新的 onChange 處理函數
          disabled={isLoading || isCodeSent}
          fullWidth
          error={!!emailError} // 根據 emailError 狀態設定 error
          helperText={emailError} // 顯示 email 錯誤訊息
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Autocomplete
            options={countryData}
            disabled={isLoading || isCodeSent}
            getOptionLabel={(option: CountryOption) =>
              `${option.name} (${option.dial_code})`
            }
            value={
              countryData.find(
                (country) => country.dial_code === countryCode
              ) || null
            }
            onChange={(event, newValue: CountryOption | null) => {
              setCountryCode(newValue ? newValue.dial_code : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("authPage.countryCodeLabel")}
                placeholder={t("authPage.countryCodePlaceHolder")}
                variant="outlined"
                disabled={isLoading || isCodeSent}
              />
            )}
            sx={{ width: "70%" }}
            disablePortal
          />
          <TextField
            label={t("authPage.phoneLabel")}
            placeholder={t("authPage.phonePlaceHolder")}
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
          disabled={
            isLoading ||
            !email ||
            !!emailError || // 禁用按鈕如果 email 有錯誤
            !countryCode ||
            !phone ||
            (isCodeSent && countdown > LOCKDOWN_TIMER - 60)
          }
          sx={{
            alignSelf: "flex-end",
            width: "fit-content",
            mt: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          startIcon={
            isLoading && !isCodeSent ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {isLoading && !isCodeSent
            ? t("authPage.sending")
            : t("authPage.requestVerificationCode")}
        </Button>

        {isCodeSent && (
          <>
            <TextField
              label={t("authPage.verificationCodeInputBox")}
              variant="outlined"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              disabled={isLoading || countdown === 0}
              fullWidth
              sx={textFieldSx}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: -1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t("authPage.codeSentInfo", { count: countdown })}
              </Typography>
              {isCodeSent && countdown > 0 && (
                <Typography variant="body2" color="text.secondary"></Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={isLoading || !isCodeSent || countdown === 0}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                startIcon={
                  isLoading && isCodeSent ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading && isCodeSent
                  ? t("authPage.verifying")
                  : t("authPage.confirmBtn")}
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Typography style={{ wordWrap: "break-word" }}>
        借我放一下啦，會刪掉 驗證碼 1234
      </Typography>
    </Box>
  );
};

export default AuthPage;
