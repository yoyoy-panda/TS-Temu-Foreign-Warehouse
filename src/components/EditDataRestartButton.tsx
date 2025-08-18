import React, { useState, useEffect, useRef } from "react";
import BasicButton from "./BasicButton";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

interface EditDataRestartButtonProps {
  onRestart: () => void;
  RESEND_TIMER: number;
}

const EditDataRestartButton: React.FC<EditDataRestartButtonProps> = ({
  onRestart,
  RESEND_TIMER,
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [disabled, setDisabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    // 清除現有的計時器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let startTime = Date.now();
    const endTime = startTime + RESEND_TIMER * 1000;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;

      // 更新 countdown
      const remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
      setCountdown(remainingSeconds);

      // 更新 progress
      let currentProgress = (elapsed / (RESEND_TIMER * 1000)) * 100;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(intervalRef.current!);
        setDisabled(false);
      }
      setProgress(currentProgress);
    }, 50);
  };

  useEffect(() => {
    // 初始化狀態
    setCountdown(RESEND_TIMER);
    setDisabled(true);
    setProgress(0);
    startTimer(); // 組件掛載時啟動計時器

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [RESEND_TIMER]); // 依賴 RESEND_TIMER，當它改變時重新啟動計時器

  const handleClick = () => {
    if (!disabled) {
      onRestart();
      // 點擊後重置狀態並重新啟動計時器
      setCountdown(RESEND_TIMER);
      setDisabled(true);
      setProgress(0);
      startTimer();
    }
  };

  return (
    <Box sx={{ position: "relative", width: "fit-content" }}>
      <BasicButton onClick={handleClick} disabled={disabled}>
        {disabled
          ? t("authPage.resendCode", { count: countdown })
          : t("authPage.resendCodeButton")}
      </BasicButton>
      {disabled && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            bgcolor: "primary.light",
            opacity: 0.5,
            borderRadius: "4px",
            transition: "width 0.05s linear",
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default EditDataRestartButton;
