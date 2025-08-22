import type {
  GenerateTokenRequest,
  GenerateTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "../types/api";

export const mockApi = {
  mockGenerateToken: async (
    request: GenerateTokenRequest
  ): Promise<GenerateTokenResponse> => {
    console.log("Mock API: generateToken request", request);
    return new Promise((resolve) => {
      if (request.email === "100@100.com") {
        resolve({
          resultCode: "100",
          success: "true",
          message: "驗證碼已發送(api)",
        });
      } else if (request.email === "200@200.com") {
        resolve({
          resultCode: "200",
          success: "false",
          message: "驗證碼建立失敗(api)，請重試",
        });
      } else if (request.email === "300@300.com") {
        resolve({
          resultCode: "300",
          success: "false",
          message: "驗證碼發送失敗(api)",
        });
      }
    });
  },
  mockVerifyToken: async (
    request: VerifyTokenRequest
  ): Promise<VerifyTokenResponse> => {
    console.log("Mock API: verifyToken request", request);
    return new Promise((resolve) => {
      if (request.authorizedCode === "100") {
        resolve({
          resultCode: "100",
          success: "true",
          message: "驗證成功(api)",
        });
      } else if (request.authorizedCode === "200") {
        resolve({
          resultCode: "200",
          success: "false",
          message: "",
        });
      } else if (request.authorizedCode === "300") {
        resolve({
          resultCode: "300",
          success: "false",
          message: "",
        });
      } else if (request.authorizedCode === "400") {
        resolve({
          resultCode: "400",
          success: "false",
          message: "",
        });
      } else if (request.authorizedCode === "500") {
        resolve({
          resultCode: "500",
          success: "false",
          message: "",
        });
      } else if (request.authorizedCode === "600") {
        resolve({
          resultCode: "600",
          success: "false",
          message: "",
        });
      }
    });
  },
};
