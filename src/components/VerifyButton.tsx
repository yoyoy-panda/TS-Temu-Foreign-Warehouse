import React from 'react';
import BasicButton from './BasicButton';
import { useTranslation } from "react-i18next";


interface VerifyButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <BasicButton onClick={onClick} disabled={disabled}>
      {t("authPage.confirmBtn")}
    </BasicButton>
  );
};

export default VerifyButton;
