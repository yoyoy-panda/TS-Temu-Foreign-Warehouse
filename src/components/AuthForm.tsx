import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import GenerateButton from "./GenerateButton";
import EditDataRestartButton from "./EditDataRestartButton";
import VerifyButton from "./VerifyButton";
import { useTranslation } from "react-i18next";
import { textFieldSx } from "../styles/commonStyles";
import CountryCodeSelect from "./CountryCodeSelect";

interface AuthFormProps {
  isparamsChecked:boolean;
  email: string;
  emailError: string | null;
  countryCode: string;
  phone: string;
  phoneError: string | null;
  authCode: string;
  isCodeSent: boolean;
  countdown: number;
  LOCKDOWN_TIMER: number;
  RESEND_TIMER: number;
  isGeneratingCode: boolean;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuthCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateCode: () => Promise<void>;
  handleVerifyCode: () => Promise<void>;
  handleResetForm: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isparamsChecked,
  email,
  emailError,
  countryCode,
  phone,
  phoneError,
  authCode,
  isCodeSent,
  countdown,
  RESEND_TIMER,
  isGeneratingCode,
  handleEmailChange,
  handleCountryCodeChange,
  handlePhoneChange,
  handleAuthCodeChange,
  handleGenerateCode,
  handleVerifyCode,
  handleResetForm,
}) => {
  const { t } = useTranslation();

  // 輸入框禁用條件：已發送驗證碼且倒數中 / 正在生成驗證碼 / 網址參數有問題
  const isInputDisabled = (isCodeSent && countdown > 0) || isGeneratingCode || !isparamsChecked;
  const isInputError =
    !email || !!emailError || !countryCode || !phone || !!phoneError;

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "500px",
        p: 3,
        boxShadow: 5,
        borderRadius: 5,
        bgcolor: "background.paper",
      }}
    >
      {/**
       * email
       */}
      <TextField
        label={t("authPage.emailLabel")}
        placeholder={t("authPage.emailPlaceHolder")}
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        disabled={isInputDisabled}
        fullWidth
        sx={textFieldSx}
        error={!!emailError}
        helperText={emailError}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        {/**
         * countrycode
         */}
        <CountryCodeSelect
          countryCode={countryCode}
          onCountryCodeChange={handleCountryCodeChange}
          disabled={isInputDisabled}
          sx={textFieldSx}
        />

        {/**
         * phone
         */}
        <TextField
          label={t("authPage.phoneLabel")}
          placeholder={t("authPage.phonePlaceHolder")}
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange}
          disabled={isInputDisabled}
          fullWidth
          sx={textFieldSx}
          type="number"
          error={!!phoneError}
          helperText={phoneError}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {/**
         * auth code
         */}
        <TextField
          label={t("authPage.verificationCodeLabel")}
          placeholder={t("authPage.verificationCodePlaceHolder")}
          variant="outlined"
          value={authCode}
          onChange={handleAuthCodeChange}
          sx={{ ...textFieldSx, width: "60%" }}
        />

        {/**
         * generate button
         */}
        {!isCodeSent || countdown === 0 ? (
          <GenerateButton
            onClick={handleGenerateCode}
            disabled={isInputError || isGeneratingCode}
            isGeneratingCode={isGeneratingCode}
          />
        ) : (
          <EditDataRestartButton
            onRestart={handleResetForm}
            RESEND_TIMER={RESEND_TIMER}
          />
        )}
      </Box>

      {/**
       * time left for auth code
       */}
      <Typography variant="body2" color="text.secondary">
        {isCodeSent ? t("authPage.codeSentInfo", { count: countdown }) : ""}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "50px",
        }}
      >
        {/**
         * verify button
         */}
        <VerifyButton onClick={handleVerifyCode} disabled={!isCodeSent} />
      </Box>
    </Box>
  );
};

export default AuthForm;
