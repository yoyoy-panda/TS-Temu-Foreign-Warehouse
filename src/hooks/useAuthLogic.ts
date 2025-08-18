import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mockGenerateToken, mockVerifyToken } from "../api/MockApi";
import { isValidEmail, isValidPhone } from "../utils/validation";

interface UseAuthLogicProps {
  LOCKDOWN_TIMER: number;
  RESEND_TIMER: number;
}

interface AuthLogicState {
  redirectLink: string | null;
  email: string;
  emailError: string | null;
  countryCode: string;
  phone: string;
  phoneError: string | null;
  authCode: string;
  ticket: string;
  isCodeSent: boolean;
  message: string | null;
  isError: boolean;
  countdown: number;
}

interface AuthLogicActions {
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuthCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateCode: () => Promise<void>;
  handleVerifyCode: () => Promise<void>;
  handleResetForm: () => void;
}

export const useAuthLogic = ({
  LOCKDOWN_TIMER,
  RESEND_TIMER,
}: UseAuthLogicProps): AuthLogicState & AuthLogicActions => {
  const location = useLocation();
  const { t } = useTranslation();

  const [redirectLink, setRedirectLink] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState("");
  const [ticket, setTicket] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get("redirectLink");
    if (link) {
      try {
        const decodedLink = decodeURIComponent(link);
        setRedirectLink(decodedLink);
        const ticketMatch = decodedLink.match(/ticket=([^&]*)/);
        if (ticketMatch && ticketMatch[1]) {
          setTicket(ticketMatch[1]);
        }
      } catch (e) {
        console.error("Error decoding redirectLink:", e);
        setMessage(t("authPage.invalidRedirectLink"));
        setIsError(true);
      }
    } else {
      setMessage(t("authPage.missingRedirectLink"));
      setIsError(true);
    }
  }, [location.search, t]);

  useEffect(() => {
    let timer: any;
    if (isCodeSent && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isCodeSent) {
      // 當倒數計時結束時，允許重新發送，但不將 isCodeSent 設為 false
      // 只有當 countdown 達到 0 且 isCodeSent 為 true 時，才顯示驗證碼過期訊息
      setMessage(t("authPage.codeExpired"));
      setIsError(true);
      setIsCodeSent(false); // 倒數計時結束時，將 isCodeSent 設為 false，以啟用輸入框
    }
    return () => clearTimeout(timer);
  }, [countdown, isCodeSent, t]);

  const handleResetForm = () => {
    setEmailError(null);
    setPhoneError(null);
    setAuthCode("");
    setIsCodeSent(false);
    setMessage(null);
    setIsError(false);
    setCountdown(0);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !isValidEmail(newEmail) && newEmail.length > 5) {
      setEmailError(t("authPage.invalidEmailFormat"));
    } else {
      setEmailError(null);
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (newPhone && !isValidPhone(newPhone)) {
      setPhoneError(t("authPage.invalidPhoneFormat"));
    } else {
      setPhoneError(null);
    }
  };

  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleGenerateCode = async () => {
    if (!isValidEmail(email)) {
      setEmailError(t("authPage.invalidEmailFormat"));
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError(t("authPage.invalidPhoneFormat"));
      return;
    }

    console.log(email, countryCode + phone, ticket);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockGenerateToken({
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success === "true") {
        setMessage(
          t("authPage.codeSentSuccess", { email: email }) || response.message
        );
        setIsCodeSent(true); // 成功發送後再設為 true，禁用輸入框
        setCountdown(LOCKDOWN_TIMER); // 每次成功發送都重置倒數計時
      } else {
        setMessage(t("authPage.sendCodeFailed") || response.message);
        setIsError(true);
        setIsCodeSent(false); // 發送失敗時，確保輸入框保持啟用
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage(t("authPage.requestError"));
      setIsError(true);
      setIsCodeSent(false); // 請求錯誤時，確保輸入框保持啟用
    } finally {
    }
  };

  const handleVerifyCode = async () => {
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockVerifyToken({
        authorizedCode: authCode,
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success === "true") {
        setMessage(response.message || t("authPage.verifySuccess"));
        setIsCodeSent(false);
        if (redirectLink) {
          window.location.href = redirectLink;
        }
      } else {
        setMessage(response.message || t("authPage.verifyCodeError"));
        setIsError(true);
        setIsCodeSent(false);
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage(t("authPage.verifyError"));
      setIsError(true);
    } finally {
    }
  };

  return {
    redirectLink,
    email,
    emailError,
    countryCode,
    phone,
    phoneError,
    authCode,
    ticket,
    isCodeSent,
    message,
    isError,
    countdown,
    handleEmailChange,
    handleCountryCodeChange,
    handlePhoneChange,
    handleAuthCodeChange,
    handleGenerateCode,
    handleVerifyCode,
    handleResetForm,
  };
};
