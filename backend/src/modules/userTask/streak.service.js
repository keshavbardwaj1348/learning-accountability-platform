const User = require("../auth/auth.model");

const isSameDay = (d1, d2) =>
  d1.toDateString() === d2.toDateString();

const isYesterday = (lastDate, today) => {
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  return isSameDay(lastDate, y);
};

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();

  if (!user.streak.lastActiveDate) {
    user.streak.current = 1;
  } else if (isSameDay(user.streak.lastActiveDate, today)) {
    return;
  } else if (isYesterday(user.streak.lastActiveDate, today)) {
    user.streak.current += 1;
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(
    user.streak.longest,
    user.streak.current
  );

  user.streak.lastActiveDate = today;
  await user.save();
};

module.exports = updateStreak;
