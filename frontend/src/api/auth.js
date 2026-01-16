import { http } from "./http";

export const loginApi = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
};

export const registerApi = async ({ email, password }) => {
  const res = await http.post("/auth/register", { email, password });
  return res.data;
};

export const logoutApi = async () => {
  const res = await http.post("/auth/logout");
  return res.data;
};
