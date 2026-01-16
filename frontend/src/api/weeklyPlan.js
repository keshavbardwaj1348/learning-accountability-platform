import { http } from "./http";

export const getWeekPlanApi = async ({ weekNumber }) => {
  const res = await http.get(`/plan/week/${weekNumber}`);
  return res.data;
};
