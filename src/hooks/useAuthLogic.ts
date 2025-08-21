import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { realApi } from "../api/RealApi";
import { isValidEmail, isValidPhone } from "../utils/validation";

interface UseAuthLogicProps {
  LOCKDOWN_TIMER: number;
  RESEND_TIMER: number;
}

interface AuthLogicState {
  isparamsChecked: boolean;
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
  severity: "success" | "error" | "info" | "warning" | null;
  countdown: number;
  isGeneratingCode: boolean;
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
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning" | null
  >(null);
  const [countdown, setCountdown] = useState(0);
  const [isparamsChecked, setisparamsChecked] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);

      const extractedRedirectLink = params.get("redirectLink");

      if (extractedRedirectLink) {
        const decodedLink = decodeURIComponent(extractedRedirectLink);
        setRedirectLink(decodedLink);
        try {
          const innerUrl = new URL(decodedLink);
          const innerParams = new URLSearchParams(innerUrl.search);
          const extractedTicket = innerParams.get("ticket");

          if (extractedTicket) {
            setTicket(extractedTicket);
            setisparamsChecked(true);
          } else {
            setMessage(t("authPage.missingRedirectLinkOrMissingTicket"));
            setSeverity("error");
          }
        } catch (e) {
          console.error("Error decoding redirectLink:", e);
          setMessage(t("authPage.invalidRedirectLinkOrInvalidTicket"));
          setSeverity("error");
        }
      } else {
        setMessage(t("authPage.missingRedirectLinkOrMissingTicket"));
        setSeverity("error");
      }
    } catch (e) {
      setMessage(t("authPage.missingRedirectLink"));
      setSeverity("error");
      console.error("Error extracting redirectLink:", e);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let startTime: number;
    let endTime: number;

    if (isCodeSent) {
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
          setSeverity("warning");
          setIsCodeSent(false);
        }
      }, 1000);
    } else {
      // 重新要求驗證碼，清除計時器
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
    setSeverity(null);
    setCountdown(0);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value.trim();
    setEmail(newEmail);
    if (newEmail && !isValidEmail(newEmail) && !(newEmail.length < 7)) {
      setEmailError(t("authPage.invalidEmailFormat"));
    } else {
      setEmailError(null);
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPhone = e.target.value.trim();
    setPhone(newPhone);
    if (newPhone && !isValidPhone(newPhone) && !(newPhone.length < 7)) {
      setPhoneError(t("authPage.invalidPhoneFormat"));
    } else {
      setPhoneError(null);
    }
  };

  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true); // 按下後立刻鎖定輸入 (在api 之前)
    setMessage(null);
    setSeverity(null);

    if (!isValidEmail(email)) {
      setEmailError(t("authPage.invalidEmailFormat"));
      setIsGeneratingCode(false); // 失敗時解除鎖定
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError(t("authPage.invalidPhoneFormat"));
      setIsGeneratingCode(false);
      return;
    }

    // 去除電話首位 0
    let processedPhone = phone;
    if (processedPhone.startsWith("0")) {
      processedPhone = processedPhone.substring(1);
      setPhone(processedPhone);
    }

    console.log(email, "(" + countryCode + ")" + processedPhone, ticket);
    setMessage(null);
    setSeverity(null);
    try {
      const response = await realApi.generateToken({
        email,
        phone: "(" + countryCode + ")" + processedPhone,
        ticket,
      });
      if (response.success) {
        switch (Number(response.resultCode)) {
          case 100:
            setMessage(t("authPage.generateCodeSuccess_100", { email: email }));
            setSeverity("success");
            setIsCodeSent(true); // 成功發送後 設為 true，禁用輸入框
            setCountdown(LOCKDOWN_TIMER); // 成功發送 => 重置倒數計時
            break;
          case 200:
            setMessage(t("authPage.generateCodeError_200"));
            setSeverity("error");
            setIsCodeSent(false); // 失敗時，保持啟用輸入框
            break;
          case 300:
            setMessage(t("authPage.generateCodeFailed_300"));
            setSeverity("error");
            setIsCodeSent(false);
            break;
          default:
            setMessage(response.message || t("authPage.unknownError"));
            setSeverity("error");
            setIsCodeSent(false);
            break;
        }
      } else {
        setMessage(response.message || t("authPage.requestError"));
        setSeverity("error");
        setIsCodeSent(false);
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage(t("authPage.requestError"));
      setSeverity("error");
      setIsCodeSent(false);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (authCode.length === 0) {
      return;
    }
    setMessage(null);
    setSeverity("error");

    // 去除首位 0
    let processedPhone = phone;
    if (processedPhone.startsWith("0")) {
      processedPhone = processedPhone.substring(1);
      setPhone(processedPhone);
    }

    try {
      const response = await realApi.verifyToken({
        authorizedCode: authCode,
        email,
        phone: "(" + countryCode + ")" + processedPhone,
        ticket,
      });
      const resultCode = Number(response.resultCode);
      switch (resultCode) {
        case 100:
          setMessage(t("authPage.verifyCodeSuccess_100"));
          setIsCodeSent(false);
          if (redirectLink) {
            window.location.href = redirectLink;
          }
          break;
        case 200:
          setMessage(t("authPage.verifyCodeError_200"));
          setSeverity("error");
          setAuthCode(""); // 驗證碼錯誤，清空輸入框讓使用者重試
          break;
        case 300:
        case 400:
        case 500:
        case 600:
          // 處理需要重新產生驗證碼的錯誤
          setSeverity("error");
          setMessage(t(`authPage.verifyCodeError_${resultCode}`));
          setAuthCode("");
          setIsCodeSent(false); // 允許使用者重新產生驗證碼
          setCountdown(0);
          break;
        default:
          setMessage(response.message || t("authPage.unknownError"));
          setSeverity("error");
          setAuthCode("");
          setIsCodeSent(false);
          setCountdown(0);
          break;
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage(t("authPage.requestError"));
      setSeverity("error");
      setAuthCode("");
      setIsCodeSent(false);
      setCountdown(0);
    }
  };

  return {
    redirectLink,
    isparamsChecked,
    email,
    emailError,
    countryCode,
    phone,
    phoneError,
    authCode,
    ticket,
    isCodeSent,
    message,
    severity,
    countdown,
    isGeneratingCode,
    handleEmailChange,
    handleCountryCodeChange,
    handlePhoneChange,
    handleAuthCodeChange,
    handleGenerateCode,
    handleVerifyCode,
    handleResetForm,
  };
};
