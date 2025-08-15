import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface BasicButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const BasicButton: React.FC<BasicButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  );
};

export default BasicButton;
