import { http } from "./http";

export const globalSearchApi = async ({ q, limit = 10 }) => {
  const res = await http.get("/search", {
    params: { q, limit },
  });
  return res.data;
};
