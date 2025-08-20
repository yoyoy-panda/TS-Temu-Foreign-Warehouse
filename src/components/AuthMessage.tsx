import React from "react";
import { Alert } from "@mui/material";

interface AuthMessageProps {
  message: string | null;
  severity?: "success" | "error" | "info" | "warning" | null;
}

const AuthMessage: React.FC<AuthMessageProps> = ({ message, severity}) => {
  if (!message) return null;

  return (
    <Alert severity={severity === null ? undefined : severity} sx={{ m: 1, width: "100%", maxWidth: "500px" }}>
      {message}
    </Alert>
  );
};

export default AuthMessage;
