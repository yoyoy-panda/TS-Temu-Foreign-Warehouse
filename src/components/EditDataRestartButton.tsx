import React, { useState, useEffect } from 'react';
import BasicButton from './BasicButton';

interface EditDataRestartButtonProps {
  onRestart: () => void;
  RESEND_TIMER: number;
}

const EditDataRestartButton: React.FC<EditDataRestartButtonProps> = ({ onRestart, RESEND_TIMER }) => {
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDisabled(false);
    }
  }, [countdown]);

  const handleClick = () => {
    if (!disabled) {
      onRestart();
    }
  };

  return (
    <BasicButton onClick={handleClick} disabled={disabled}>
      {disabled ? `重新發送 (${countdown}s)` : '重新發送'}
    </BasicButton>
  );
};

export default EditDataRestartButton;
