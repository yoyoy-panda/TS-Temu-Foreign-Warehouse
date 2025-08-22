import React from "react";
import styled from "@emotion/styled";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Logo = styled.img`
  padding-top: 5px;
  padding-left: 15px;
  height: 50px; /* LOGO 高度 */
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
      elevation={0}
      color="transparent"
      sx={{
        boxShadow: "none",
        bgcolor: "transparent",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          bgcolor: "transparent",
        }}
      >
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
