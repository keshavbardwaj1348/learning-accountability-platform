import { http } from "./http";

export const loginApi = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  const token = res.data?.data?.accessToken;
  if (token) localStorage.setItem("accessToken", token);
  return res.data;
};

export const registerApi = async ({ email, password }) => {
  const res = await http.post("/auth/register", { email, password });
  const token = res.data?.data?.accessToken;
  if (token) localStorage.setItem("accessToken", token);
  return res.data;
};

export const logoutApi = async () => {
  localStorage.removeItem("accessToken");
  return { status: "success" };
};