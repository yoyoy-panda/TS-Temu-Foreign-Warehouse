import React from "react";
import { Alert } from "@mui/material";

interface AuthMessageProps {
  message: string | null;
  isError: boolean;
}

const AuthMessage: React.FC<AuthMessageProps> = ({ message, isError }) => {
  if (!message) return null;

  return (
    <Alert
      severity={isError ? "error" : "info"}
      sx={{ mb: 4, width: "100%", maxWidth: "500px" }}
    >
      {message}
    </Alert>
  );
};

export default AuthMessage;
