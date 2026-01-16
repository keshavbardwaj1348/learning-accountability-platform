import { http } from "./http";

export const startPomodoroApi = async ({ taskKey, weekNumber, dayNumber }) => {
  const res = await http.post("/pomodoro/start", { taskKey, weekNumber, dayNumber });
  return res.data;
};

export const stopPomodoroApi = async () => {
  const res = await http.post("/pomodoro/stop");
  return res.data;
};

export const getPomodoroDailySummaryApi = async ({ weekNumber, dayNumber }) => {
  const res = await http.get(`/pomodoro/daily-summary?weekNumber=${weekNumber}&dayNumber=${dayNumber}`);
  return res.data;
};
