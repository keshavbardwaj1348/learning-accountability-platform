// import { http } from "./http";

// export const listDsaProblemsApi = async () => {
//   const res = await http.get("/dsa/problems");
//   return res.data;
// };

// export const solveDsaProblemApi = async ({ problemId, selfRating }) => {
//   const res = await http.post(`/dsa/${problemId}/solve`, { selfRating });
//   return res.data;
// };

// export const getTodayRevisionsApi = async () => {
//   const res = await http.get("/dsa/revisions/today");
//   return res.data;
// };


import { http } from "./http";

export const listDsaProblemsApi = async () => {
  const res = await http.get("/dsa/problems");
  return res.data;
};

export const solveDsaProblemApi = async ({ problemId, selfRating }) => {
  const res = await http.post(`/dsa/${problemId}/solve`, { selfRating });
  return res.data;
};

export const getTodayRevisionsApi = async () => {
  const res = await http.get("/dsa/revisions/today");
  return res.data;
};

export const saveDsaNotesApi = async ({ problemId, notesMarkdown, codeSnippet }) => {
  const res = await http.patch(`/dsa/${problemId}/notes`, {
    notesMarkdown,
    codeSnippet,
  });
  return res.data;
};

export const resetDsaProblemApi = async ({ problemId }) => {
  const res = await http.patch(`/dsa/${problemId}/reset`);
  return res.data;
};
