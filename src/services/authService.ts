import api from "./api";
import type { LoginRequest } from "../models/LoginRequest";
import type { TokenResponse } from "../models/TokenResponse";

export async function login(
  request: LoginRequest
): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(
    "/auth/token",
    request
  );

  localStorage.setItem(
    "access_token",
    response.data.accessToken
  );

  return response.data;
}

export function logout(): void {
  localStorage.removeItem("access_token");
}