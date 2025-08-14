export interface GenerateTokenRequest {
  email: string;
  phone: string;
  ticket: string;
}

export interface GenerateTokenResponse {
  resultCode: string;
  success: string;
  message: string;
}

export interface VerifyTokenRequest {
  authorizedCode: string;
  email: string;
  phone: string;
  ticket: string;
}

export interface VerifyTokenResponse {
  resultCode: string;
  success: string;
  message: string;
}
