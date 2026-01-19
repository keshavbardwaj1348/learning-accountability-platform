// require("dotenv").config();
// const mongoose = require("mongoose");
// const LearningPlan = require("../modules/learningPlan/learningPlan.model");

// const week1 = require("./learningPlan.week1");
// const week2 = require("./learningPlan.week2");
// const week3 = require("./learningPlan.week3");
// const week4 = require("./learningPlan.week4");
// const week5 = require("./learningPlan.week5");
// const week6 = require("./learningPlan.week6");
// const week7 = require("./learningPlan.week7");
// const week8 = require("./learningPlan.week8");

// const weeks = [week1, week2, week3, week4, week5, week6, week7, week8];

// const seed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to DB");

//     for (const week of weeks) {
//       await LearningPlan.updateOne(
//         { version: week.version, weekNumber: week.weekNumber },
//         { $set: week },
//         { upsert: true }
//       );

//       console.log(`✅ Week ${week.weekNumber} seeded`);
//     }

//     console.log("🎉 All 8 weeks seeded successfully");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Seeding failed:", err);
//     process.exit(1);
//   }
// };

// seed();



require("dotenv").config();
const mongoose = require("mongoose");
const LearningPlan = require("../modules/learningPlan/learningPlan.model");

const week1 = require("./learningPlan.week1");
const week2 = require("./learningPlan.week2");
const week3 = require("./learningPlan.week3");
const week4 = require("./learningPlan.week4");
const week5 = require("./learningPlan.week5");
const week6 = require("./learningPlan.week6");
const week7 = require("./learningPlan.week7");
const week8 = require("./learningPlan.week8");

const seedDsaFromLearningPlan = require("./seedDsaFromLearningPlan");

const weeks = [week1, week2, week3, week4, week5, week6, week7, week8];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // 1) Seed all 8 weeks into LearningPlan
    for (const week of weeks) {
      await LearningPlan.updateOne(
        { version: week.version, weekNumber: week.weekNumber },
        { $set: week },
        { upsert: true }
      );

      console.log(`✅ Week ${week.weekNumber} seeded`);
    }

    console.log("🎉 All 8 weeks seeded successfully");

    // 2) Seed DSA problems from learning plan
    console.log("🧠 Seeding DSA problems from weekly plan...");
    await seedDsaFromLearningPlan();

    console.log("✅ DSA problems seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
