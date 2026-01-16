module.exports = {
  version: "v1",
  weekNumber: 6,
  title: "Advanced MERN + Graphs + ML Evaluation",
  goal: "Learn scalability/performance + master Graph DSA + model evaluation tradeoffs",
  days: [
    {
      dayNumber: 36,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Backend",
          topic: "Performance + Pagination/Filtering",
          tasks: [
            "Latency vs throughput",
            "Offset vs cursor pagination",
            "Filtering strategies + trade-offs"
          ],
          outcomes: ["Think about backend performance clearly"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Graph Basics",
          tasks: [
            "Graph terminology (directed/undirected)",
            "Adjacency list vs matrix",
            "Add edges in graph"
          ],
          outcomes: ["Represent graphs confidently"]
        }
      ]
    },
    {
      dayNumber: 37,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Backend",
          topic: "Caching Basics",
          tasks: ["Cache hit vs miss", "Where caching fits", "When NOT to cache"],
          outcomes: ["Use caching wisely"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "BFS",
          tasks: ["BFS traversal", "Shortest path in unweighted graph"],
          outcomes: ["Solve BFS problems with queue logic"]
        }
      ]
    },
    {
      dayNumber: 38,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Backend",
          topic: "DB Performance + Scaling",
          tasks: ["Query optimization ideas", "Indexes revision", "Vertical vs horizontal scaling"],
          outcomes: ["Explain scaling at junior-mid level"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "DFS",
          tasks: ["DFS traversal", "Count connected components"],
          outcomes: ["Use DFS correctly with visited structure"]
        }
      ]
    },
    {
      dayNumber: 39,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Backend",
          topic: "API Design at Scale",
          tasks: ["Idempotency", "Versioning", "Backward compatibility", "Rate limiting basics"],
          outcomes: ["Design safer APIs for production"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Core Graph Problems",
          tasks: ["Detect cycle (undirected)", "Number of islands", "Path exists"],
          outcomes: ["Solve high-frequency graph questions"]
        }
      ]
    },
    {
      dayNumber: 40,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "System Design",
          topic: "System Design Basics",
          tasks: ["Approach a design question", "Clarify requirements", "Identify components"],
          outcomes: ["Speak structured in system design rounds"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Model Evaluation + Bias/Variance",
          tasks: ["Accuracy vs precision vs recall", "Bias vs variance", "Overfit vs underfit"],
          outcomes: ["Explain evaluation trade-offs correctly"]
        }
      ]
    },
    {
      dayNumber: 41,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "Project",
          topic: "Performance Improvements in Job Portal",
          tasks: ["Pagination", "Indexes", "Caching decisions"],
          outcomes: ["Make job portal feel scalable"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Graph Applications",
          tasks: ["Flood fill", "Rotten oranges"],
          outcomes: ["Handle multi-source BFS logic"]
        }
      ]
    },
    {
      dayNumber: 42,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Marathon",
          topic: "Graphs Practice",
          tasks: ["Solve 6–8 graph problems (medium focus)"],
          outcomes: ["Be strong in graph interview rounds"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Cross Validation + Model Selection",
          tasks: ["Train/val/test split", "Why cross-validation", "Choosing model trade-offs"],
          outcomes: ["Understand model selection reasoning"]
        }
      ]
    }
  ]
};
