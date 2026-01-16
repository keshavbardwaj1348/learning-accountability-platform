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
