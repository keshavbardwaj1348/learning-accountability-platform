// import { http } from "./http";

// export const updateTaskStatusApi = async ({ taskKey, status, weekNumber, dayNumber }) => {
//   const res = await http.patch(`/tasks/${taskKey}/status`, {
//     status,
//     weekNumber,
//     dayNumber,
//   });
//   return res.data;
// };


import { http } from "./http";

export const updateTaskStatusApi = async ({
  taskKey,
  status,
  weekNumber,
  dayNumber,
}) => {
  const res = await http.patch(`/tasks/${taskKey}/status`, {
    status,
    weekNumber,
    dayNumber,
  });
  return res.data;
};

export const getTasksByDayApi = async ({ weekNumber, dayNumber }) => {
  const res = await http.get(`/tasks/day`, {
    params: { weekNumber, dayNumber },
  });
  return res.data;
};
