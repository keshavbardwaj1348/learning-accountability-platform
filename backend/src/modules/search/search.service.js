const UserTask = require("../userTask/userTask.model");

function buildPreview(text = "", q = "") {
  if (!text) return "";
  const t = String(text);
  const idx = t.toLowerCase().indexOf(q.toLowerCase());

  if (idx === -1) return t.slice(0, 140);

  const start = Math.max(0, idx - 40);
  const end = Math.min(t.length, idx + 100);
  return t.slice(start, end);
}

exports.searchGlobalService = async ({ userId, q, limit = 20 }) => {
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  // Regex search (safe + simple)
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const matches = await UserTask.find({
    userId,
    $or: [{ taskKey: regex }, { notesMarkdown: regex }],
  })
    .select("weekNumber dayNumber taskKey status notesMarkdown updatedAt")
    .sort({ updatedAt: -1 })
    .limit(safeLimit)
    .lean();

  return matches.map((m) => ({
    type: "task",
    weekNumber: m.weekNumber,
    dayNumber: m.dayNumber,
    taskKey: m.taskKey,
    status: m.status,
    notesPreview: buildPreview(m.notesMarkdown || "", q),
    updatedAt: m.updatedAt,
  }));
};
