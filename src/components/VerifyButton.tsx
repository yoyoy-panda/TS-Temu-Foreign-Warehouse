import React from 'react';
import BasicButton from './BasicButton';

interface VerifyButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ onClick, disabled }) => {
  return (
    <BasicButton onClick={onClick} disabled={disabled}>
      驗證
    </BasicButton>
  );
};

export default VerifyButton;
