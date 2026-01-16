module.exports = {
  version: "v1",
  weekNumber: 2,
  title: "Backend Foundation + DSA Patterns",
  goal: "Learn Node/Express fundamentals and master Sliding Window + Prefix Sum",
  days: [
    {
      dayNumber: 8,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Node.js",
          topic: "Node.js Fundamentals + Event Loop",
          tasks: [
            "What is Node.js?",
            "Single-threaded but non-blocking",
            "Where Node is used vs not used",
            "Event loop overview: stack, queues, microtasks"
          ],
          outcomes: ["Explain Node.js concurrency in interviews"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Sliding Window (Fixed Window)",
          tasks: [
            "Maximum sum subarray of size K",
            "Average of subarrays of size K"
          ],
          outcomes: ["Solve fixed-window questions using O(n) approach"]
        }
      ]
    },
    {
      dayNumber: 9,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Node.js",
          topic: "Modules + npm",
          tasks: [
            "CommonJS vs ES Modules",
            "require vs import",
            "package.json essentials"
          ],
          outcomes: ["Understand Node module system confidently"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Prefix Sum Basics",
          tasks: [
            "Range sum query (immutable)",
            "Equilibrium index",
            "Subarray sum equals K"
          ],
          outcomes: ["Use prefix sum for fast range/subarray computations"]
        }
      ]
    },
    {
      dayNumber: 10,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Express",
          topic: "Express Basics + REST",
          tasks: [
            "What is Express?",
            "Middleware concept",
            "Request-response lifecycle",
            "REST basics + important status codes"
          ],
          outcomes: ["Design basic REST APIs clearly"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Sliding Window (Variable Window)",
          tasks: [
            "Longest substring without repeating characters",
            "Longest subarray with sum ≤ K"
          ],
          outcomes: ["Solve variable-window questions confidently"]
        }
      ]
    },
    {
      dayNumber: 11,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Express",
          topic: "Middleware Deep Dive",
          tasks: [
            "Types of middleware",
            "Custom middleware",
            "Error-handling middleware",
            "Where middleware fits in real apps"
          ],
          outcomes: ["Explain middleware in interview-ready way"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Revision + Variations",
          tasks: [
            "Minimum size subarray sum",
            "Count number of subarrays with sum equal to K"
          ],
          outcomes: ["Improve accuracy on common patterns"]
        }
      ]
    },
    {
      dayNumber: 12,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Node.js",
          topic: "Async in Backend + Error Handling",
          tasks: [
            "Callbacks vs Promises",
            "async/await in Express routes",
            "Try/catch patterns",
            "Centralized error handling concept"
          ],
          outcomes: ["Write async APIs safely without common bugs"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Mixed Practice (Window + Prefix)",
          tasks: [
            "Subarray sum equals K (optimized)",
            "Longest substring with at most K distinct characters"
          ],
          outcomes: ["Handle mixed window/prefix questions"]
        }
      ]
    },
    {
      dayNumber: 13,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Express Practice",
          topic: "Mini Backend Practice",
          tasks: [
            "Create basic APIs: Create job, List jobs, Apply for job",
            "Implement controllers/routes cleanly"
          ],
          outcomes: ["Build small API module end-to-end"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML + Math",
          topic: "Supervised Learning Intro",
          tasks: [
            "Linear regression intuition",
            "Features vs labels",
            "Overfitting vs underfitting",
            "Probability basics (light)"
          ],
          outcomes: ["Explain regression conceptually + clearly"]
        }
      ]
    },
    {
      dayNumber: 14,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Marathon",
          topic: "Sliding Window + Prefix Sum",
          tasks: [
            "Solve 6–8 problems mixed",
            "Focus on time/space complexity explanation"
          ],
          outcomes: ["Master core pattern recognition"]
        },
        {
          timeBlock: "Evening",
          category: "System Thinking",
          topic: "Job Portal Backend Review + AI Mapping",
          tasks: [
            "Explain APIs aloud",
            "Think about edge cases",
            "How to rank jobs (rule-based vs ML)"
          ],
          outcomes: ["Connect backend + AI + product thinking"]
        }
      ]
    }
  ]
};
