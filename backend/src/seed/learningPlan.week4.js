module.exports = {
  version: "v1",
  weekNumber: 4,
  title: "Auth, Security + Recursion + ML Core Models",
  goal: "Implement secure authentication and master recursion + ML core model intuition",
  days: [
    {
      dayNumber: 22,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Security",
          topic: "Authentication Fundamentals",
          tasks: [
            "Authentication vs authorization",
            "Stateless vs stateful auth",
            "Where auth lives in backend architecture"
          ],
          outcomes: ["Explain authentication in a web app"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Recursion Basics",
          tasks: ["Factorial", "Fibonacci", "Sum of digits"],
          outcomes: ["Understand base case + recursion flow"]
        }
      ]
    },
    {
      dayNumber: 23,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Security",
          topic: "JWT Deep Dive",
          tasks: [
            "JWT structure (header/payload/signature)",
            "Access token vs refresh token",
            "Token validation flow"
          ],
          outcomes: ["Explain JWT working confidently"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Recursion with Strings",
          tasks: ["Reverse string", "Palindrome check", "Power of number"],
          outcomes: ["Solve recursion string problems cleanly"]
        }
      ]
    },
    {
      dayNumber: 24,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Security",
          topic: "Authorization + RBAC",
          tasks: [
            "Role-based access (admin/recruiter/applicant)",
            "Middleware-based authorization",
            "Common mistakes"
          ],
          outcomes: ["Implement RBAC correctly"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Recursion with Arrays",
          tasks: ["Sum of array", "Check sorted array", "Linear search recursion"],
          outcomes: ["Handle index recursion without bugs"]
        }
      ]
    },
    {
      dayNumber: 25,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Security",
          topic: "Backend Security Basics",
          tasks: [
            "NoSQL injection basics",
            "XSS (concept)",
            "CSRF (concept)",
            "Validation & rate limiting"
          ],
          outcomes: ["Explain how backend prevents vulnerabilities"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Recursion Medium (Backtracking Intro)",
          tasks: ["Generate all subsets", "String permutations (basic)", "Recursive binary search"],
          outcomes: ["Understand choice → recursion → backtrack pattern"]
        }
      ]
    },
    {
      dayNumber: 26,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Interview Prep",
          topic: "Auth Interview Questions",
          tasks: [
            "How JWT works?",
            "How to secure APIs?",
            "How logout works with refresh tokens?"
          ],
          outcomes: ["Answer auth questions clearly"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Regression + Bias-Variance",
          tasks: [
            "Linear regression intuition",
            "Bias-variance tradeoff",
            "Overfitting vs underfitting"
          ],
          outcomes: ["Explain regression + model behavior"]
        }
      ]
    },
    {
      dayNumber: 27,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Backend Practice",
          topic: "Implement Full Auth Flow",
          tasks: [
            "Signup/login",
            "JWT generation",
            "Protected routes",
            "Centralized error handling"
          ],
          outcomes: ["Build complete auth module end-to-end"]
        },
        {
          timeBlock: "Evening",
          category: "DSA + AI/ML",
          topic: "Recursion Applications + Classification",
          tasks: [
            "Climbing stairs",
            "Combination sum (basic)",
            "Logistic regression intuition",
            "Decision tree intuition"
          ],
          outcomes: ["Be comfortable with recursion + classification models"]
        }
      ]
    },
    {
      dayNumber: 28,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Marathon",
          topic: "Recursion Practice",
          tasks: ["Solve 6–8 recursion problems mixed"],
          outcomes: ["Improve recursion confidence + clarity"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Model Evaluation",
          tasks: ["Accuracy", "Precision", "Recall", "F1-score", "Train vs test split"],
          outcomes: ["Explain evaluation metrics correctly"]
        }
      ]
    }
  ]
};
