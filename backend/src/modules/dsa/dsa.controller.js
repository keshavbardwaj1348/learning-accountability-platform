const DSAProblem = require("./dsaProblem.model");
const UserDSAProgress = require("./userDsaProgress.model");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

const getNextRevisionDate = (rating) => {
  const days = Number(rating);
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next;
};

// Add master problem
const addProblem = asyncHandler(async (req, res) => {
  const { title, topic, difficulty } = req.body;

  if (!title || !topic || !difficulty) {
    throw new AppError("title, topic, difficulty are required", 400);
  }

  const problem = await DSAProblem.create({
    title,
    topic,
    difficulty,
  });

  res.status(201).json({
    status: "success",
    data: problem,
  });
});

// List problems (with filters)
// const listProblems = asyncHandler(async (req, res) => {
//   const { topic, difficulty, q } = req.query;

//   const filter = {};
//   if (topic) filter.topic = topic;
//   if (difficulty) filter.difficulty = difficulty;

//   if (q) {
//     filter.title = { $regex: q, $options: "i" };
//   }

//   const problems = await DSAProblem.find(filter).sort({ createdAt: -1 });

//   res.json({
//     status: "success",
//     data: problems,
//   });
// });


// List problems (with filters) + attach user progress
const listProblems = asyncHandler(async (req, res) => {
  const { topic, difficulty, q } = req.query;

  const filter = {};
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  const problems = await DSAProblem.find(filter).sort({ createdAt: -1 });

  // fetch all progress for this user (only for these problems)
  const problemIds = problems.map((p) => p._id);

  const progresses = await UserDSAProgress.find({
    userId: req.userId,
    problemId: { $in: problemIds },
  });

  const progressMap = {};
  progresses.forEach((pr) => {
    progressMap[String(pr.problemId)] = pr;
  });

  const merged = problems.map((p) => {
    const progress = progressMap[String(p._id)] || null;

    return {
      ...p.toObject(),
      progress: progress ? progress.toObject() : null,
    };
  });

  res.json({
    status: "success",
    data: merged,
  });
});


// Mark solved + set SRS revision date
const solveProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { selfRating } = req.body;

  if (![1, 3, 7].includes(selfRating)) {
    throw new AppError("selfRating must be 1, 3, or 7", 400);
  }

  const problem = await DSAProblem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const progress = await UserDSAProgress.findOneAndUpdate(
    { userId: req.userId, problemId },
    {
      $set: {
        status: "SOLVED",
        selfRating,
        lastSolvedAt: new Date(),
        nextRevisionDate: getNextRevisionDate(selfRating),
      },
    },
    { new: true, upsert: true }
  );

  res.json({
    status: "success",
    message: "Problem marked as solved",
    data: progress,
  });
});

// Get today's revisions
const getTodayRevisions = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const revisions = await UserDSAProgress.find({
    userId: req.userId,
    nextRevisionDate: { $gte: start, $lte: end },
  }).populate("problemId");

  res.json({
    status: "success",
    data: revisions,
  });
});

// Save Notes + Code Snippets for a problem (user-specific)
const saveNotesAndCode = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { notesMarkdown, codeSnippet } = req.body;

  // codeSnippet is optional
  // Example:
  // { language: "js", label: "Optimized", code: "..." }

  const problem = await DSAProblem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const update = {};

  if (typeof notesMarkdown === "string") {
    update.notesMarkdown = notesMarkdown;
  }

  if (codeSnippet && typeof codeSnippet === "object") {
    const snippet = {
      language: codeSnippet.language || "js",
      label: codeSnippet.label || "Solution",
      code: codeSnippet.code || "",
      createdAt: new Date(),
    };

    update.$push = { codeSnippets: snippet };
  }

  const progress = await UserDSAProgress.findOneAndUpdate(
    { userId: req.userId, problemId },
    update,
    { new: true, upsert: true }
  );

  res.json({
    status: "success",
    message: "Notes / code saved",
    data: progress,
  });
});

// Reset progress (mark as NOT_STARTED)
const resetProblemProgress = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const progress = await UserDSAProgress.findOneAndUpdate(
    { userId: req.userId, problemId },
    {
      $set: {
        status: "NOT_STARTED",
        selfRating: 1,
        lastSolvedAt: null,
        nextRevisionDate: null,
      },
    },
    { new: true, upsert: true }
  );

  res.json({
    status: "success",
    message: "Problem reset to NOT_STARTED",
    data: progress,
  });
});



module.exports = {
  addProblem,
  listProblems,
  solveProblem,
  getTodayRevisions,
  saveNotesAndCode,
  resetProblemProgress,
};
