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
    return "demo-post-token";
  }

  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  return data.token || data.jwt || data.accessToken;
}

export function getAuthenticatedUser() {
  if (localStorage.getItem("token") === "demo-post-token") {
    return Promise.resolve({
      id: 1,
      name: "Usuario Demo",
      username: DEFAULT_USER.username,
      email: "admin@demo.com"
    });
  }

  return request("/auth/me");
}
