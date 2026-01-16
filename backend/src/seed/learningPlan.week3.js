module.exports = {
  version: "v1",
  weekNumber: 3,
  title: "Database Thinking + ML Foundations",
  goal: "Master MongoDB basics + Stack/Queue DSA + core ML lifecycle understanding",
  days: [
    {
      dayNumber: 15,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB",
          topic: "MongoDB Basics + CRUD",
          tasks: [
            "What is NoSQL? Document vs collection",
            "BSON vs JSON",
            "Insert/find/update/delete basics"
          ],
          outcomes: ["Explain MongoDB at interview level"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Stack Basics",
          tasks: [
            "Implement stack using array",
            "Valid parentheses"
          ],
          outcomes: ["Solve basic stack problems confidently"]
        }
      ]
    },
    {
      dayNumber: 16,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB",
          topic: "Data Modeling",
          tasks: [
            "Embedded vs referenced documents",
            "One-to-many modeling",
            "Job Portal schema draft (User/Job/Application)"
          ],
          outcomes: ["Design schema with trade-offs explained"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Stack Applications",
          tasks: [
            "Next greater element",
            "Reverse string using stack"
          ],
          outcomes: ["Recognize stack pattern quickly"]
        }
      ]
    },
    {
      dayNumber: 17,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB",
          topic: "Indexing + Query Performance",
          tasks: [
            "What is indexing?",
            "Single vs compound index",
            "Index costs",
            "explain() basics (concept)"
          ],
          outcomes: ["Know when indexes help/hurt"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Queue Basics",
          tasks: [
            "Implement queue using array",
            "Circular queue (basic understanding)"
          ],
          outcomes: ["Implement queue operations correctly"]
        }
      ]
    },
    {
      dayNumber: 18,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB",
          topic: "Aggregation Framework",
          tasks: [
            "$match, $group, $project",
            "Pipeline concept",
            "Use cases: count jobs by category, top companies"
          ],
          outcomes: ["Build simple aggregation pipelines"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Queue Applications",
          tasks: [
            "Implement queue using stack",
            "First non-repeating character in a stream"
          ],
          outcomes: ["Use queue + hashing together"]
        }
      ]
    },
    {
      dayNumber: 19,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB + Express",
          topic: "Mongoose Integration + Errors",
          tasks: [
            "Schema vs model",
            "Validation basics",
            "Duplicate key errors",
            "Connection failure handling"
          ],
          outcomes: ["Handle DB errors cleanly in backend"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Stack + Queue Revision",
          tasks: [
            "Min stack",
            "Implement stack using queue"
          ],
          outcomes: ["Strengthen design + conversions"]
        }
      ]
    },
    {
      dayNumber: 20,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "MongoDB Practice",
          topic: "Hands-on Queries + Aggregations",
          tasks: [
            "Write real find/update queries",
            "Try aggregation pipelines",
            "Experiment with indexes"
          ],
          outcomes: ["Work confidently with real DB operations"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "ML Fundamentals",
          tasks: [
            "What is ML vs rule-based systems",
            "ML lifecycle (data → training → evaluation → deployment)",
            "Supervised vs unsupervised learning"
          ],
          outcomes: ["Explain ML generically in interviews"]
        }
      ]
    },
    {
      dayNumber: 21,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Marathon",
          topic: "Stack + Queue Mixed",
          tasks: [
            "Evaluate postfix expression",
            "Stock span problem",
            "Sliding window maximum (deque intro)"
          ],
          outcomes: ["Be strong in stack/queue high-ROI questions"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Unsupervised Learning Intro",
          tasks: [
            "Clustering basics",
            "K-means intuition",
            "Dimensionality reduction (high level)"
          ],
          outcomes: ["Understand unsupervised learning use cases"]
        }
      ]
    }
  ]
};
