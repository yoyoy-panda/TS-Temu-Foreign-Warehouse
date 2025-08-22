import React from "react";
import styled from "@emotion/styled";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Logo = styled.img`
  height: 40px; /* LOGO 高度 */
  margin-right: 20px;
`;

interface TopbarProps {
  logoSrc?: string;
  title?: string;
  children?: React.ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ logoSrc, title, children }) => {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{ boxShadow: "none", bgcolor: "transparent", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {logoSrc && <Logo src={logoSrc} alt="Total Solution" />}
        {title && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
