import React from "react";
import {
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import GenerateButton from "./GenerateButton";
import EditDataRestartButton from "./EditDataRestartButton";
import VerifyButton from "./VerifyButton";
import { useTranslation } from "react-i18next";
import { textFieldSx } from "../styles/commonStyles";
import CountryCodeSelect from "./CountryCodeSelect";

interface AuthFormProps {
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
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuthCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateCode: () => Promise<void>;
  handleVerifyCode: () => Promise<void>;
  handleResetForm: () => void; // 新增重置表單的 prop
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  emailError,
  countryCode,
  phone,
  phoneError,
  authCode,
  isCodeSent,
  countdown,
  RESEND_TIMER,
  handleEmailChange,
  handleCountryCodeChange,
  handlePhoneChange,
  handleAuthCodeChange,
  handleGenerateCode,
  handleVerifyCode,
  handleResetForm, // 接收重置表單的 prop
}) => {
  const { t } = useTranslation();

  const isInputDisabled = isCodeSent && countdown > 0;

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
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
      noValidate
      autoComplete="off"
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
          type="tel"
          inputProps={{ pattern: "\\d*" }}
          error={!!phoneError}
          helperText={phoneError}
        />
      </Box>
      {/**
       * generate request
       */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!isCodeSent || countdown === 0 ? (
          <GenerateButton
            onClick={handleGenerateCode}
            disabled={!email || !!emailError || !countryCode || !phone}
          />
        ) : (
          <EditDataRestartButton
            onRestart={handleResetForm} // 將 onRestart 綁定到 handleResetForm
            RESEND_TIMER={RESEND_TIMER}
          />
        )}
      </Box>

      {isCodeSent && (
        <>
          {/**
           * auth code
           */}
          <TextField
            label={t("authPage.verificationCodeInputBox")}
            variant="outlined"
            value={authCode}
            onChange={handleAuthCodeChange}
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
            {/**
             * auth code time left
             */}
            <Typography variant="body2" color="text.secondary">
              {t("authPage.codeSentInfo", { count: countdown })}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            {/**
             * verify button
             */}
            <VerifyButton onClick={handleVerifyCode} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AuthForm;
