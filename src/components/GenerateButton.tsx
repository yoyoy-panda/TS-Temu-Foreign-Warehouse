import React from "react";
import BasicButton from "./BasicButton";
import { useTranslation } from "react-i18next";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <BasicButton onClick={onClick} disabled={disabled}>
      {t("authPage.requestVerificationCode")}
    </BasicButton>
  );
};

export default GenerateButton;
