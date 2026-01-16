module.exports = {
  version: "v1",
  weekNumber: 7,
  title: "Revision & Mock Interviews",
  goal: "Recall MERN quickly, solve DSA under pressure, and master project + AI talking points",
  days: [
    {
      dayNumber: 1,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MERN Revision",
          topic: "Backend Revision (Node + Express + MongoDB)",
          tasks: [
            "Node.js internals recap (event loop, async)",
            "Express middleware flow (req → res)",
            "MongoDB schema + indexes revision",
            "Auth/security quick recap (JWT, cookies, refresh)"
          ],
          outcomes: ["Explain backend flow confidently in interviews"]
        },
        {
          timeBlock: "Evening",
          category: "DSA Revision",
          topic: "Arrays + Strings + Hashing (Core Revision)",
          tasks: [
            "Two Sum",
            "Second Largest Element in Array",
            "First Non-Repeating Character in String",
            "Check Palindrome (Two Pointers)"
          ],
          outcomes: ["Solve core revision questions with clean explanation"]
        }
      ]
    },

    {
      dayNumber: 2,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MERN Revision",
          topic: "Frontend Revision (React + Hooks + Performance)",
          tasks: [
            "React render cycle + reconciliation recap",
            "Hooks recap: useState, useEffect, useMemo, useCallback",
            "Common performance issues (unnecessary renders)",
            "API integration flow (loading/error states)"
          ],
          outcomes: ["Answer common React interview questions quickly"]
        },
        {
          timeBlock: "Evening",
          category: "DSA Revision",
          topic: "Trees + Recursion (Revision)",
          tasks: [
            "Maximum Depth of Binary Tree",
            "Inorder Traversal",
            "Check if Array is Sorted (Recursion)",
            "Generate All Subsets (Basic)"
          ],
          outcomes: ["Be confident in recursion + tree traversal explanation"]
        }
      ]
    },

    {
      dayNumber: 3,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Project",
          topic: "Project Deep Dive (Job Portal / Learning Platform)",
          tasks: [
            "Explain project architecture end-to-end",
            "Database design explanation (collections + relations)",
            "Auth flow explanation (login, refresh, logout)",
            "What you would improve if given more time"
          ],
          outcomes: ["Deliver project explanation like a product-company engineer"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML Revision",
          topic: "ML Fundamentals (Interview Talking Points)",
          tasks: [
            "ML lifecycle overview (data → train → eval → deploy)",
            "Supervised vs unsupervised learning",
            "Feature engineering (why it matters)",
            "Overfitting vs underfitting + bias-variance intuition"
          ],
          outcomes: ["Speak AI/ML confidently without deep math"]
        }
      ]
    },

    {
      dayNumber: 4,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Mock Interview",
          topic: "MERN Mock Interview (Simulation)",
          tasks: [
            "Tell me about yourself (60-sec story)",
            "Explain login/auth flow without code",
            "Explain middleware + error handling",
            "Explain React API integration and state management"
          ],
          outcomes: ["Handle MERN interview questions without hesitation"]
        },
        {
          timeBlock: "Evening",
          category: "DSA Revision",
          topic: "Graphs Revision (BFS/DFS Core)",
          tasks: [
            "Number of Islands",
            "BFS traversal",
            "Detect Cycle in Undirected Graph"
          ],
          outcomes: ["Be ready for graph-based interview problems"]
        }
      ]
    },

    {
      dayNumber: 5,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Mock Interview",
          topic: "DSA Mock Interview (Timed)",
          tasks: [
            "Pick 3 random problems (timed)",
            "Explain approach before coding",
            "Write clean code once",
            "State time + space complexity clearly"
          ],
          outcomes: ["Perform DSA under pressure with calm communication"]
        },
        {
          timeBlock: "Evening",
          category: "Weak Area Fix",
          topic: "Lowest Confidence Topic",
          tasks: [
            "Revisit your weakest topic (Arrays/Sliding Window/Trees/Graphs)",
            "Solve 2 problems without help",
            "Write mistakes + corrections",
            "Re-solve 1 problem from scratch"
          ],
          outcomes: ["Fix weak areas instead of learning new topics"]
        }
      ]
    },

    {
      dayNumber: 6,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Full Mock",
          topic: "Full Mock Interview Day (Part 1)",
          tasks: [
            "MERN mock interview (backend + frontend)",
            "Project explanation (architecture + tradeoffs)",
            "Debugging scenario discussion"
          ],
          outcomes: ["Simulate real product-company interview environment"]
        },
        {
          timeBlock: "Evening",
          category: "Career",
          topic: "Resume + Question Bank",
          tasks: [
            "Improve resume bullets (impact + metrics)",
            "Write 10 MERN interview questions + answers",
            "Write 10 DSA interview questions + patterns",
            "Write 5 AI/ML talking points"
          ],
          outcomes: ["Be ready with answers + confidence for real interviews"]
        }
      ]
    },

    {
      dayNumber: 7,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Practice",
          topic: "Final Mixed DSA Practice",
          tasks: [
            "Solve 5 mixed medium problems",
            "Focus on speed + explanation",
            "Avoid new patterns",
            "Write time/space complexity"
          ],
          outcomes: ["Boost confidence before interview week"]
        },
        {
          timeBlock: "Evening",
          category: "Communication",
          topic: "Confidence + Communication Practice",
          tasks: [
            "Practice STAR stories (conflict, failure, success)",
            "Explain project end-to-end aloud",
            "Practice salary expectation answer",
            "List 5 strengths + 3 improvement areas"
          ],
          outcomes: ["Communicate like a 15+ LPA candidate"]
        }
      ]
    }
  ]
};
