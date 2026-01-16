import { http } from "./http";

export const getCurrentDayPlanApi = async () => {
  const res = await http.get("/plan/current-day");
  return res.data;
};
