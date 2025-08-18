import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuthLogic } from "../hooks/useAuthLogic";
import AuthMessage from "../components/AuthMessage";
import AuthForm from "../components/AuthForm";

//TODO
const LOCKDOWN_TIMER = 10;
const RESEND_TIMER = 5;

const AuthPage: React.FC = () => {
  
  const { t } = useTranslation();
  const {
    email,
    emailError,
    countryCode,
    phone,
    phoneError,
    authCode,
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
    handleResetForm,
  } = useAuthLogic({ LOCKDOWN_TIMER, RESEND_TIMER });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 左右置中
        justifyContent: "start", // 上下置上
        minHeight: "100dvh",
        padding: 4,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
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
        phoneError={phoneError}
        authCode={authCode}
        isCodeSent={isCodeSent}
        countdown={countdown}
        LOCKDOWN_TIMER={LOCKDOWN_TIMER}
        RESEND_TIMER={RESEND_TIMER}
        handleEmailChange={handleEmailChange}
        handleCountryCodeChange={handleCountryCodeChange}
        handlePhoneChange={handlePhoneChange}
        handleAuthCodeChange={handleAuthCodeChange}
        handleGenerateCode={handleGenerateCode}
        handleVerifyCode={handleVerifyCode}
        handleResetForm={handleResetForm}
      />

      <Typography>正確驗證碼：1234</Typography>
    </Box>
  );
};

export default AuthPage;
