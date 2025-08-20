import React from "react";
import BasicButton from "./BasicButton";
import { useTranslation } from "react-i18next";
import { CircularProgress, Box } from "@mui/material";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGeneratingCode?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled,
  isGeneratingCode,
}) => {
  const { t } = useTranslation();
  return (
    <BasicButton
      onClick={onClick}
      disabled={disabled || isGeneratingCode}
      sx={{
        width: "40%",
        whiteSpace: "normal",
        height: "56px",
        p: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isGeneratingCode ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={24} color="inherit" />
          {t("authPage.requestVerificationCode")}
        </Box>
      ) : (
        t("authPage.requestVerificationCode")
      )}
    </BasicButton>
  );
};

export default GenerateButton;
