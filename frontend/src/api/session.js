// import { http } from "./http";

// export const checkSessionApi = async () => {
//   // simple endpoint to verify access token
//   const res = await http.get("/analytics/streak");
//   return res.data;
// };


import { http } from "./http";

export const checkSessionApi = async () => {
  const res = await http.get("/auth/me");
  return res.data;
};
