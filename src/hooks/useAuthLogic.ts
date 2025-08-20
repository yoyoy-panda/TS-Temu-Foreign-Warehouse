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
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

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
    setTicket(TEMP_ticketRandomGenerate());
  }, [location.search, t]);

  const TEMP_ticketRandomGenerate = () => {
    const randomNumber = Math.random();
    const scaledNumber = randomNumber * 10;
    const flooredNumber = Math.floor(scaledNumber);
    const finalNumber = flooredNumber + 1;
    const tt = [
      "aa",
      "bb",
      "cc",
      "dd",
      "ee",
      "ff",
      "gg",
      "hh",
      "ii",
      "jj",
      "kk",
      "ll",
      "mm",
      "nn",
      "oo",
    ];
    return String(tt[finalNumber]);
  };

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
    let newPhone = e.target.value;
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
    setIsGeneratingCode(true); // 按下後立刻鎖定輸入
    setMessage(null); // 清除之前的訊息
    setIsError(false); // 清除之前的錯誤狀態

    if (!isValidEmail(email)) {
      setEmailError(t("authPage.invalidEmailFormat"));
      setIsGeneratingCode(false); // 失敗時解除鎖定
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError(t("authPage.invalidPhoneFormat"));
      setIsGeneratingCode(false); // 失敗時解除鎖定
      return;
    }


    // 去除首位 0
    let processedPhone = phone; // 預設使用原始輸入

    if (processedPhone.startsWith("0")) {
      processedPhone = processedPhone.substring(1);
      setPhone(processedPhone);
    }

    console.log(email, "(" + countryCode + ")" + processedPhone, ticket);
    setMessage(null);
    setIsError(false);
    try {
      //const response = await mockGenerateToken({
      const response = await realApi.generateToken({
        email,
        phone: "(" + countryCode + ")" + processedPhone,
        ticket,
      });
      if (response.success) {
        switch (Number(response.resultCode)) {
          case 100:
            setMessage(t("authPage.generateCodeSuccess_100", { email: email }));
            setIsCodeSent(true); // 成功發送後再設為 true，禁用輸入框
            setCountdown(LOCKDOWN_TIMER); // 成功發送 => 重置倒數計時
            break;
          case 200:
            setMessage(t("authPage.generateCodeError_200"));
            setIsError(true);
            setIsCodeSent(false); // 發送失敗時，確保輸入框保持啟用
            break;
          case 300:
            setMessage(t("authPage.generateCodeFailed_300"));
            setIsError(true);
            setIsCodeSent(false); // 發送失敗時，確保輸入框保持啟用
            break;
          default:
            setMessage(response.message || t("authPage.unknownError"));
            setIsError(true);
            setIsCodeSent(false);
            break;
        }
      } else {
        setMessage(response.message || t("authPage.sendCodeFailed"));
        setIsError(true);
        setIsCodeSent(false); // 發送失敗時，確保輸入框保持啟用
      }
    } catch (error) {
      console.error("Generate code error:", error);
      setMessage(t("authPage.requestError"));
      setIsError(true);
      setIsCodeSent(false); // 請求錯誤時，確保輸入框保持啟用
    } finally {
      setIsGeneratingCode(false); // 無論成功或失敗，都解除鎖定
    }
  };

  const handleVerifyCode = async () => {
    setMessage(null);
    setIsError(false);

    // 去除首位 0
    let processedPhone = phone; // 預設使用原始輸入

    if (processedPhone.startsWith("0")) {
      processedPhone = processedPhone.substring(1);
      setPhone(processedPhone);
    }

    try {
      // const response = await mockVerifyToken({
      const response = await realApi.verifyToken({
        authorizedCode: authCode,
        email,
        phone: "(" + countryCode + ")" + processedPhone,
        ticket,
      });
      const resultCode = Number(response.resultCode);
      switch (resultCode) {
        case 100:
          setMessage(t("authPage.verifyCodeSuccess"));
          setIsCodeSent(false);
          if (redirectLink) {
            window.location.href = redirectLink;
          }
          break;
        case 200:
          setMessage(t("authPage.verifyCodeError_200"));
          setIsError(true);
          setAuthCode(""); // 驗證碼錯誤，清空輸入框讓使用者重試
          break;
        case 300:
        case 400:
        case 500:
        case 600:
          // 處理需要重新產生驗證碼的錯誤
          if (resultCode === 300) setMessage(t("authPage.verifyCodeError_300"));
          if (resultCode === 400) setMessage(t("authPage.verifyCodeError_400"));
          if (resultCode === 500) setMessage(t("authPage.verifyCodeError_500"));
          if (resultCode === 600) setMessage(t("authPage.verifyCodeError_600"));
          setIsError(true);
          setAuthCode("");
          setIsCodeSent(false); // 允許使用者重新產生驗證碼
          setCountdown(0);
          break;
        default:
          setMessage(response.message || t("authPage.unknownError"));
          setIsError(true);
          setAuthCode("");
          setIsCodeSent(false);
          setCountdown(0);
          break;
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage(t("authPage.requestError"));
      setIsError(true);
      setAuthCode("");
      setIsCodeSent(false);
      setCountdown(0);
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
