import { http } from "./http";

export const updateTaskNotesApi = async ({ taskKey, notesMarkdown }) => {
  const res = await http.patch(`/tasks/${taskKey}/notes`, { notesMarkdown });
  return res.data;
};
