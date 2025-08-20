import { post, get, handleApiResponse } from "./commonApi";
// Request
import type { GenerateTokenRequest, VerifyTokenRequest } from "../types/api.d";
// Response
import type {
  GenerateTokenResponse,
  VerifyTokenResponse,
} from "../types/api.d";

export const realApi = {
  generateToken: async (data: GenerateTokenRequest) => {
    console.log(data);
    return handleApiResponse<GenerateTokenResponse>({
      content: await post<GenerateTokenRequest, GenerateTokenResponse>(
        "/authorized/generate",
        data
      ),
    });
  },

  verifyToken: async (data: VerifyTokenRequest) => {
    console.log(data);
    return handleApiResponse<VerifyTokenResponse>({
      content: await post<VerifyTokenRequest, VerifyTokenResponse>(
        "/authorized/verify",
        data
      ),
    });
  },
};
