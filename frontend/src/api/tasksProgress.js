import { http } from "./http";

export const getDayTaskProgressApi = async ({ weekNumber, dayNumber }) => {
  const res = await http.get(
    `/tasks/day?weekNumber=${weekNumber}&dayNumber=${dayNumber}`
  );
  return res.data;
};
