import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mockGenerateToken, mockVerifyToken } from "../api/MockApi";
import { realApi } from "../api/RealApi";
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
    //TODO
    setTicket("yohanburger");
  }, [location.search, t]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let startTime: number;
    let endTime: number;

    if (isCodeSent) {
      // 只有在 isCodeSent 變為 true 時才初始化計時器
      if (countdown === LOCKDOWN_TIMER) {
        // 剛開始倒數
        startTime = Date.now();
        endTime = startTime + LOCKDOWN_TIMER * 1000;
      } else {
        // 倒數中，根據當前 countdown 重新計算 startTime
        endTime = Date.now() + countdown * 1000;
        startTime = endTime - LOCKDOWN_TIMER * 1000;
      }

      timer = setInterval(() => {
        const now = Date.now();
        const remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        setCountdown(remainingSeconds);

        if (remainingSeconds === 0) {
          clearInterval(timer!);
          setMessage(t("authPage.codeExpired"));
          setIsCodeSent(false);
        }
      }, 1000); // 每秒更新一次，與顯示的秒數一致
    } else {
      // 如果 isCodeSent 為 false，確保計時器被清除
      if (timer) {
        clearInterval(timer);
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isCodeSent, t, LOCKDOWN_TIMER]);

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
      //const response = await mockGenerateToken({
      const response = await realApi.generateToken({
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success) {
        setMessage(
          t("authPage.codeSentSuccess", { email: email }) || response.message
        );
        setIsCodeSent(true); // 成功發送後再設為 true，禁用輸入框
        setCountdown(LOCKDOWN_TIMER); // 成功發送 => 重置倒數計時
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
        //const response = await realApi.verifyToken({
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
        setAuthCode("");
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
