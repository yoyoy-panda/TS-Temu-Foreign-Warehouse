import React from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
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
  LOCKDOWN_TIMER,
  RESEND_TIMER,
  handleEmailChange,
  handleCountryCodeChange,
  handlePhoneChange,
  handleAuthCodeChange,
  handleGenerateCode,
  handleVerifyCode,
}) => {
  const { t } = useTranslation();

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
        disabled={isCodeSent}
        fullWidth
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
          disabled={isCodeSent}
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
          disabled={isCodeSent}
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
      <Button
        variant="contained"
        onClick={handleGenerateCode}
        disabled={
          !email ||
          !!emailError ||
          !countryCode ||
          !phone ||
          countdown > RESEND_TIMER
        }
        sx={{
          alignSelf: "flex-end",
          width: "fit-content",
          mt: 1,
          position: "relative",
          overflow: "hidden",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": { bgcolor: "primary.dark" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${
              ((LOCKDOWN_TIMER - countdown) / (LOCKDOWN_TIMER - RESEND_TIMER)) *
              100
            }%`,
            bgcolor: "primary.main",
            transition: "width 0.5s ease-in-out",
            zIndex: 0,
          },
          "& .MuiButton-label": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Typography sx={{ position: "relative", zIndex: 1 }}>
          {countdown > RESEND_TIMER
            ? t("authPage.resendCode", { count: countdown - RESEND_TIMER })
            : t("authPage.requestVerificationCode")}
        </Typography>
      </Button>

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
            disabled={countdown === 0}
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
            <Button
              variant="contained"
              onClick={handleVerifyCode}
              disabled={!isCodeSent || countdown === 0}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {t("authPage.confirmBtn")}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AuthForm;
