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
  authCode: string;
  isLoading: boolean;
  isCodeSent: boolean;
  countdown: number;
  LOCKDOWN_TIMER: number;
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
  authCode,
  isLoading,
  isCodeSent,
  countdown,
  LOCKDOWN_TIMER,
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
      <TextField
        label={t("authPage.emailLabel")}
        placeholder={t("authPage.emailPlaceHolder")}
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        disabled={isLoading || isCodeSent}
        fullWidth
        error={!!emailError}
        helperText={emailError}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <CountryCodeSelect
          countryCode={countryCode}
          onCountryCodeChange={handleCountryCodeChange}
          disabled={isLoading || isCodeSent}
        />
        <TextField
          label={t("authPage.phoneLabel")}
          placeholder={t("authPage.phonePlaceHolder")}
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange}
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
          !!emailError ||
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
            onChange={handleAuthCodeChange}
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
  );
};

export default AuthForm;
