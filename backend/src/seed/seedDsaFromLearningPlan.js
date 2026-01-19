const path = require("path");
const DSAProblem = require("../modules/dsa/dsaProblem.model");

const weeks = [1, 2, 3, 4, 5, 6, 7, 8];

async function seedDsaFromLearningPlan() {
  let totalInserted = 0;

  for (const weekNumber of weeks) {
    const weekFile = path.join(__dirname, `learningPlan.week${weekNumber}.js`);

    let weekPlan;
    try {
      weekPlan = require(weekFile);
    } catch (err) {
      console.log(`⚠️ Week ${weekNumber} seed not found, skipping...`);
      continue;
    }

    const days = weekPlan.days || [];

    for (const day of days) {
      const schedule = day.schedule || [];

      for (const block of schedule) {
        if (block.category !== "DSA") continue;

        const topic = block.topic || "DSA";

        for (const task of block.tasks || []) {
          const title = String(task).trim();
          if (!title) continue;

          const res = await DSAProblem.updateOne(
            { title },
            {
              $setOnInsert: {
                title,
                topic,
                difficulty: "Easy",
              },
            },
            { upsert: true }
          );

          if (res.upsertedCount > 0) {
            totalInserted++;
          }
        }
      }
    }
  }

  console.log(`✅ DSA Seed Completed: Inserted ${totalInserted} new problems`);
}

module.exports = seedDsaFromLearningPlan;
