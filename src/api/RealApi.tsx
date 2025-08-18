import { post, get, handleApiResponse } from "./commonApi";
// Request
import type {
  GenerateTokenRequest,
  VerifyTokenRequest,
} from "../types/api.d";
// Response
import type {
  GenerateTokenResponse,
  VerifyTokenResponse,
} from "../types/api.d";

export const realApi = {
  generateToken: async (data: GenerateTokenRequest) => {
    return handleApiResponse<GenerateTokenResponse>({
      content: await post<GenerateTokenRequest, GenerateTokenResponse>("/POST-api-authorized-generate", data),
    });
  },

  verifyToken: async (data: VerifyTokenRequest) => {
    return handleApiResponse<VerifyTokenResponse>({
      content: await post<VerifyTokenRequest, VerifyTokenResponse>("/POST-api-authorized-verify", data),
    });
  },
};
