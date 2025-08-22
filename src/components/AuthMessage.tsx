import React from "react";
import { Alert } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface AuthMessageProps {
  message: string | null;
  severity?: "success" | "error" | "info" | "warning" | null;
  sx?: SxProps<Theme>;
}

const AuthMessage: React.FC<AuthMessageProps> = ({ message, severity, sx }) => {
  if (!message) return null;

  return (
    <Alert
      severity={severity === null ? undefined : severity}
      sx={{ ...sx, width: "100%" }}
    >
      {message}
    </Alert>
  );
};

export default AuthMessage;
