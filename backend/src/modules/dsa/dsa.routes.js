// const express = require("express");
// const protect = require("../../middlewares/authMiddleware");
// const {
//   addProblem,
//   listProblems,
//   solveProblem,
//   getTodayRevisions,
// } = require("./dsa.controller");

// const router = express.Router();

// router.post("/problems", protect, addProblem);
// router.get("/problems", protect, listProblems);

// router.post("/:problemId/solve", protect, solveProblem);
// router.get("/revisions/today", protect, getTodayRevisions);

// module.exports = router;


// const express = require("express");
// const protect = require("../../middlewares/authMiddleware");
// const {
//   addProblem,
//   listProblems,
//   solveProblem,
//   getTodayRevisions,
//   saveNotesAndCode,
// } = require("./dsa.controller");

// const router = express.Router();

// router.post("/problems", protect, addProblem);
// router.get("/problems", protect, listProblems);

// router.post("/:problemId/solve", protect, solveProblem);
// router.get("/revisions/today", protect, getTodayRevisions);

// // ✅ NEW: save notes + code
// router.patch("/:problemId/notes", protect, saveNotesAndCode);

// module.exports = router;



const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  addProblem,
  listProblems,
  solveProblem,
  getTodayRevisions,
  saveNotesAndCode,
  resetProblemProgress,
} = require("./dsa.controller");

const router = express.Router();

router.post("/problems", protect, addProblem);
router.get("/problems", protect, listProblems);

router.post("/:problemId/solve", protect, solveProblem);
router.get("/revisions/today", protect, getTodayRevisions);

// ✅ save notes + code
router.patch("/:problemId/notes", protect, saveNotesAndCode);

// ✅ NEW: reset progress (unsolve)
router.patch("/:problemId/reset", protect, resetProblemProgress);

module.exports = router;
