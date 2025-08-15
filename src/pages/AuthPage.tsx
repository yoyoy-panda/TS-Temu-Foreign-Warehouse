import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuthLogic } from "../hooks/useAuthLogic";
import AuthMessage from "../components/AuthMessage";
import AuthForm from "../components/AuthForm";

const LOCKDOWN_TIMER = 300;

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    email,
    emailError,
    countryCode,
    phone,
    authCode,
    isLoading,
    isCodeSent,
    message,
    isError,
    countdown,
    handleEmailChange,
    handleCountryCodeChange,
    handlePhoneChange,
    handleAuthCodeChange,
    handleGenerateCode,
    handleVerifyCode,
  } = useAuthLogic({ LOCKDOWN_TIMER });

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

      <AuthMessage message={message} isError={isError} />

      <AuthForm
        email={email}
        emailError={emailError}
        countryCode={countryCode}
        phone={phone}
        authCode={authCode}
        isLoading={isLoading}
        isCodeSent={isCodeSent}
        countdown={countdown}
        LOCKDOWN_TIMER={LOCKDOWN_TIMER}
        handleEmailChange={handleEmailChange}
        handleCountryCodeChange={handleCountryCodeChange}
        handlePhoneChange={handlePhoneChange}
        handleAuthCodeChange={handleAuthCodeChange}
        handleGenerateCode={handleGenerateCode}
        handleVerifyCode={handleVerifyCode}
      />

      <Typography style={{ wordWrap: "break-word" }}>
        借我放一下啦，會刪掉 驗證碼 1234
      </Typography>
    </Box>
  );
};

export default AuthPage;
