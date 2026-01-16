import { http } from "./http";

export const getOverviewApi = async ({ weekNumber, dayNumber }) => {
  const res = await http.get(
    `/analytics/overview?weekNumber=${weekNumber}&dayNumber=${dayNumber}`
  );
  return res.data;
};
