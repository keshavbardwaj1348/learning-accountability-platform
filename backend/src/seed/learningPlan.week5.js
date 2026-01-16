module.exports = {
  version: "v1",
  weekNumber: 5,
  title: "React Depth + Trees + Feature Engineering",
  goal: "Learn React internals and master Trees + ML feature engineering concepts",
  days: [
    {
      dayNumber: 29,
      label: "Monday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "React Internals Refresh",
          tasks: ["Virtual DOM", "Reconciliation", "How React updates UI"],
          outcomes: ["Explain how React works internally"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Tree Basics",
          tasks: ["Create a binary tree", "Inorder traversal (recursive)"],
          outcomes: ["Understand tree structure + traversal recursion"]
        }
      ]
    },
    {
      dayNumber: 30,
      label: "Tuesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "State/Props + useEffect",
          tasks: ["State vs props", "useState", "useEffect dependencies", "Cleanup functions"],
          outcomes: ["Avoid common hooks mistakes"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Tree Traversals",
          tasks: ["Preorder traversal", "Postorder traversal"],
          outcomes: ["Explain all traversals clearly"]
        }
      ]
    },
    {
      dayNumber: 31,
      label: "Wednesday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "Hooks Deep Dive",
          tasks: ["Rules of hooks", "Custom hooks concept", "Component reusability basics"],
          outcomes: ["Build reusable React logic"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Binary Search Tree",
          tasks: ["Search in BST", "Insert in BST"],
          outcomes: ["Apply BST property correctly"]
        }
      ]
    },
    {
      dayNumber: 32,
      label: "Thursday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "Performance Basics",
          tasks: ["Re-rendering", "memo", "useMemo", "useCallback", "When NOT to optimize"],
          outcomes: ["Prevent unnecessary renders"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Core Tree Problems",
          tasks: ["Maximum depth of tree", "Check symmetric tree", "Lowest common ancestor (basic)"],
          outcomes: ["Solve common tree interview problems"]
        }
      ]
    },
    {
      dayNumber: 33,
      label: "Friday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "React Interview Q&A",
          tasks: ["State vs props", "Why keys matter", "How to avoid extra renders"],
          outcomes: ["Answer React interview questions confidently"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Feature Engineering + Scaling",
          tasks: [
            "What is a feature?",
            "Numerical vs categorical",
            "Normalization vs standardization"
          ],
          outcomes: ["Explain feature scaling correctly"]
        }
      ]
    },
    {
      dayNumber: 34,
      label: "Saturday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "React",
          topic: "Backend Integration",
          tasks: ["API calls", "Loading/error states", "Pagination basics", "Filters UI"],
          outcomes: ["Build real data-driven components"]
        },
        {
          timeBlock: "Evening",
          category: "DSA",
          topic: "Tree Medium Problems",
          tasks: ["Diameter of binary tree", "Lowest common ancestor (re-solve)"],
          outcomes: ["Handle tree medium logic with confidence"]
        }
      ]
    },
    {
      dayNumber: 35,
      label: "Sunday",
      schedule: [
        {
          timeBlock: "Morning",
          category: "DSA Marathon",
          topic: "Trees Practice",
          tasks: ["Solve 6–8 tree problems (easy → medium)"],
          outcomes: ["Be consistent with tree recursion patterns"]
        },
        {
          timeBlock: "Evening",
          category: "AI/ML",
          topic: "Data Preprocessing Pipeline",
          tasks: ["Missing values", "Outliers", "Train-test split concept"],
          outcomes: ["Understand preprocessing before modeling"]
        }
      ]
    }
  ]
};
