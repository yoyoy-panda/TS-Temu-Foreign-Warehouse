import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mockGenerateToken, mockVerifyToken } from "../api/MockApi";
import { isValidEmail } from "../utils/validation";

interface UseAuthLogicProps {
  LOCKDOWN_TIMER: number;
}

interface AuthLogicState {
  redirectLink: string | null;
  email: string;
  emailError: string | null;
  countryCode: string;
  phone: string;
  authCode: string;
  ticket: string;
  isLoading: boolean;
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
}

export const useAuthLogic = ({
  LOCKDOWN_TIMER,
}: UseAuthLogicProps): AuthLogicState & AuthLogicActions => {
  const location = useLocation();
  const { t } = useTranslation();

  const [redirectLink, setRedirectLink] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [ticket, setTicket] = useState("");

  const [isLoading, setIsLoading] = useState(false);
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
    let timer: number;
    if (isCodeSent && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isCodeSent) {
      setIsCodeSent(false);
      setMessage(t("authPage.codeExpired"));
      setIsError(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCodeSent, t]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !isValidEmail(newEmail)) {
      setEmailError(t("authPage.invalidEmailFormat"));
    } else {
      setEmailError(null);
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleGenerateCode = async () => {
    if (!isValidEmail(email)) {
      setEmailError(t("authPage.invalidEmailFormat"));
      return;
    }

    console.log(email, countryCode + phone, ticket);
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await mockGenerateToken({
        email,
        phone: countryCode + phone,
        ticket,
      });
      if (response.success === "true") {
        setMessage(response.message || t("authPage.codeSentSuccess"));
        setIsCodeSent(true);
        setCountdown(LOCKDOWN_TIMER);
      } else {
        setMessage(response.message || t("authPage.sendCodeFailed"));
        setIsError(true);
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage(t("authPage.requestError"));
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
      setIsLoading(false);
    }
  };

  return {
    redirectLink,
    email,
    emailError,
    countryCode,
    phone,
    authCode,
    ticket,
    isLoading,
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
  };
};
