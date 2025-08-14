import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { mockGenerateToken, mockVerifyToken } from '../api/mockapi';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const [redirectLink, setRedirectLink] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [ticket, setTicket] = useState(''); // Assuming ticket comes from somewhere, for now, a placeholder

  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get('redirectLink');
    if (link) {
      try {
        // Decode the redirectLink parameter
        const decodedLink = decodeURIComponent(link);
        setRedirectLink(decodedLink);
        // Extract ticket from the decoded link
        const ticketMatch = decodedLink.match(/ticket=([^&]*)/);
        if (ticketMatch && ticketMatch[1]) {
          setTicket(ticketMatch[1]);
        }
      } catch (e) {
        console.error('Error decoding redirectLink:', e);
        setMessage('無效的跳轉連結');
        setIsError(true);
      }
    } else {
      setMessage('缺少 redirectLink 參數');
      setIsError(true);
    }
  }, [location.search]);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockGenerateToken({ email, phone, ticket });
      if (response.success === 'true') {
        setMessage(response.message || '驗證碼已發送，五分鐘內有效');
        setIsCodeSent(true);
      } else {
        setMessage(response.message || '發送驗證碼失敗');
        setIsError(true);
      }
    } catch (error) {
      console.error('Generate code error:', error);
      setMessage('請求驗證碼時發生錯誤');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockVerifyToken({ authorizedCode: authCode, email, phone, ticket });
      if (response.success === 'true') {
        setMessage(response.message || '驗證成功，正在跳轉...');
        setIsCodeSent(false); // Reset for next time if needed
        // Redirect to the decoded link
        if (redirectLink) {
          window.location.href = redirectLink;
        }
      } else {
        setMessage(response.message || '驗證碼錯誤');
        setIsError(true);
      }
    } catch (error) {
      console.error('Verify code error:', error);
      setMessage('驗證碼驗證時發生錯誤');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        TS Temu UI 驗證頁面
      </Typography>

      {message && (
        <Alert severity={isError ? 'error' : 'info'} sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
          {message}
        </Alert>
      )}

      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isCodeSent}
          fullWidth
        />
        <TextField
          label="Phone (含國碼)"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading || isCodeSent}
          fullWidth
        />
        {!isCodeSent ? (
          <Button
            variant="contained"
            onClick={handleGenerateCode}
            disabled={isLoading || (!email && !phone)}
            fullWidth
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? '發送中...' : '生成驗證碼'}
          </Button>
        ) : (
          <>
            <TextField
              label="驗證碼"
              variant="outlined"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              disabled={isLoading}
              fullWidth
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: -1, mb: 1 }}>
              驗證碼已發送至您的 Email/Phone，五分鐘內有效。
            </Typography>
            <Button
              variant="contained"
              onClick={handleVerifyCode}
              disabled={isLoading || authCode.length !== 4} // Assuming 4-digit code
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? '驗證中...' : '驗證並跳轉'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AuthPage;
