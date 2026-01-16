import { http } from "./http";

export const getHeatmapApi = async ({ days = 30 }) => {
  const res = await http.get(`/analytics/heatmap?days=${days}`);
  return res.data;
};

export const getWeeklyProgressApi = async ({ weekNumber }) => {
  const res = await http.get(`/analytics/weekly-progress?weekNumber=${weekNumber}`);
  return res.data;
};
