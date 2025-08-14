import type {
  GenerateTokenRequest,
  GenerateTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "../types/api";

export const mockGenerateToken = async (
  request: GenerateTokenRequest
): Promise<GenerateTokenResponse> => {
  console.log("Mock API: generateToken request", request);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (
        request.email === "yoyoy.twcp@gmail.com" ||
        request.phone === "123"
      ) {
        resolve({
          resultCode: "0000",
          success: "true",
          message: "驗證碼已發送",
        });
      } else {
        resolve({
          resultCode: "9999",
          success: "false",
          message: "驗證碼發送失敗",
        });
      }
    }, 1000);
  });
};

export const mockVerifyToken = async (
  request: VerifyTokenRequest
): Promise<VerifyTokenResponse> => {
  console.log("Mock API: verifyToken request", request);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (request.authorizedCode === "1234") {
        resolve({
          resultCode: "0000",
          success: "true",
          message: "驗證成功",
        });
      } else {
        resolve({
          resultCode: "9999",
          success: "false",
          message: "驗證碼錯誤",
        });
      }
    }, 1000);
  });
};
