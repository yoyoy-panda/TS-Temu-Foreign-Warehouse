/*import type {
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
    if (
      
        request.email === "yoyoy.twcp@gmail.com" ||
        request.phone === "123"
        
      true
    ) {
      resolve({
        resultCode: "0000",
        success: "true",
        message: "驗證碼已發送(api)",
      });
    } else {
      resolve({
        resultCode: "9999",
        success: "false",
        message: "驗證碼發送失敗(api)",
      });
    }
  });
};

export const mockVerifyToken = async (
  request: VerifyTokenRequest
): Promise<VerifyTokenResponse> => {
  console.log("Mock API: verifyToken request", request);
  return new Promise((resolve) => {
    if (request.authorizedCode === "1234") {
      resolve({
        resultCode: "0000",
        success: "true",
        message: "驗證成功(api)",
      });
    } else {
      resolve({
        resultCode: "9999",
        success: "false",
        message: "驗證碼錯誤(api)",
      });
    }
  });
};
*/