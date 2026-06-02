import { request } from "./http.js";

export const DEFAULT_USER = {
  username: "admin",
  password: "admin123"
};

export async function login(credentials) {
  if (
    credentials.username === DEFAULT_USER.username &&
    credentials.password === DEFAULT_USER.password
  ) {
    return "demo-product-token";
  }

  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  return data.token || data.jwt || data.accessToken;
}

