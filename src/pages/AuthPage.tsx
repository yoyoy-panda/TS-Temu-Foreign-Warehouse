import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuthLogic } from "../hooks/useAuthLogic";
import AuthForm from "../components/AuthForm";

// TODO
// 300 , 60
const LOCKDOWN_TIMER = 300;
const RESEND_TIMER = 10;

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    isparamsChecked,
    email,
    emailError,
    countryCode,
    phone,
    phoneError,
    authCode,
    isCodeSent,
    message,
    severity,
    countdown,
    isGeneratingCode,
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
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        minHeight: "100dvh",
        padding: 25,
        bgcolor: theme.palette.background.default + "00",
        color: "text.primary",
      })}
    >
      <AuthForm
        isparamsChecked={isparamsChecked}
        email={email}
        emailError={emailError}
        countryCode={countryCode}
        phone={phone}
        phoneError={phoneError}
        authCode={authCode}
        isCodeSent={isCodeSent}
        countdown={countdown}
        message={message}
        severity={severity}
        LOCKDOWN_TIMER={LOCKDOWN_TIMER}
        RESEND_TIMER={RESEND_TIMER}
        handleEmailChange={handleEmailChange}
        handleCountryCodeChange={handleCountryCodeChange}
        handlePhoneChange={handlePhoneChange}
        handleAuthCodeChange={handleAuthCodeChange}
        handleGenerateCode={handleGenerateCode}
        handleVerifyCode={handleVerifyCode}
        handleResetForm={handleResetForm}
        isGeneratingCode={isGeneratingCode}
      />
    </Box>
  );
};

export default AuthPage;
