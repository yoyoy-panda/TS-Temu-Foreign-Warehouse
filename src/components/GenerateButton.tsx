import React from 'react';
import BasicButton from './BasicButton';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled }) => {
  return (
    <BasicButton onClick={onClick} disabled={disabled}>
      生成驗證碼
    </BasicButton>
  );
};

export default GenerateButton;
