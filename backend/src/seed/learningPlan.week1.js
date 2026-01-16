module.exports = {
  version: "v1",
  weekNumber: 1,
  title: "Foundation Week",
  goal: "Understand JS fundamentals, DSA basics, and intro to AI",
  days: [
    {
      dayNumber: 1,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "JavaScript",
          topic: "Execution Context & Call Stack",
          tasks: [
            "What happens when a JS file runs",
            "Execution context",
            "Call stack",
            "Global vs function execution context"
          ],
          outcomes: ["Explain how JavaScript executes code internally"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Arrays Basics",
          tasks: [
            "Find maximum element",
            "Find minimum element",
            "Reverse an array",
            "Sum of elements",
            "Count even/odd numbers"
          ],
          outcomes: ["Solve basic array problems confidently"]
        }
      ]
    },
    {
      dayNumber: 2,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "JavaScript",
          topic: "var / let / const + Memory",
          tasks: [
            "Scope differences",
            "Hoisting (concept only)",
            "Temporal Dead Zone",
            "When to use what (interview angle)"
          ],
          outcomes: ["Answer: Why is let preferred over var?"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Strings Basics",
          tasks: [
            "Reverse a string",
            "Check palindrome",
            "Count characters",
            "First non-repeating character",
            "Check anagram"
          ],
          outcomes: ["Solve basic string problems confidently"]
        }
      ]
    },
    {
      dayNumber: 3,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "JavaScript",
          topic: "Functions & Closures",
          tasks: [
            "Function declaration vs expression",
            "Arrow functions",
            "Closures (intuition only)"
          ],
          outcomes: ["Explain closure in simple words with one example"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Two Pointers Pattern",
          tasks: [
            "Reverse array using two pointers",
            "Pair with given sum (sorted array)",
            "Remove duplicates from sorted array",
            "Palindrome check"
          ],
          outcomes: ["Apply two-pointer logic correctly"]
        }
      ]
    },
    {
      dayNumber: 4,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "JavaScript",
          topic: "Objects & References",
          tasks: [
            "Objects vs primitives",
            "Reference vs value",
            "Shallow copy vs deep copy"
          ],
          outcomes: ["Answer: Why does object mutation cause bugs?"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Hashing Basics",
          tasks: [
            "Frequency count",
            "Duplicate detection",
            "First repeating element",
            "Two sum",
            "Unique elements count"
          ],
          outcomes: ["Use Map/Set confidently for hashing questions"]
        }
      ]
    },
    {
      dayNumber: 5,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "JavaScript",
          topic: "Async JS Intro",
          tasks: [
            "Synchronous vs asynchronous",
            "Callback problem (callback hell)",
            "Promise basics (concept only)"
          ],
          outcomes: ["Explain async JS without writing code"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Revision Day",
          tasks: [
            "Re-solve 5 problems from Mon–Thu",
            "Fix weak areas (arrays/strings/hashing)"
          ],
          outcomes: ["Improve speed + reduce mistakes"]
        }
      ]
    },
    {
      dayNumber: 6,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MERN",
          topic: "MERN Big Picture",
          tasks: [
            "How frontend talks to backend",
            "REST APIs",
            "What happens when user logs in"
          ],
          outcomes: ["Understand end-to-end MERN flow"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "AI/ML Intro + Light Math",
          tasks: [
            "What is Machine Learning?",
            "Types of ML",
            "Where ML fits in Job Portal",
            "Mean, Median, Variance (intuition)"
          ],
          outcomes: ["Explain ML basics without fear"]
        }
      ]
    },
    {
      dayNumber: 7,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA",
          topic: "Mixed Practice (Arrays + Strings)",
          tasks: [
            "Solve 8 mixed easy problems",
            "Focus on clean approach + edge cases"
          ],
          outcomes: ["Build confidence + consistency"]
        },
        {
          timeBlock: "Evening",
          category: "JavaScript + AI/ML",
          topic: "Revision + AI Thinking",
          tasks: [
            "Explain JS concepts aloud",
            "Note interview questions",
            "Recommendation logic thinking",
            "Matching jobs to users (features examples)"
          ],
          outcomes: ["Be ready for Week 2"]
        }
      ]
    }
  ]
};
