const { searchGlobalService } = require("./search.service");

exports.searchGlobal = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.json({
        status: "success",
        data: {
          query: "",
          results: [],
        },
      });
    }

    const results = await searchGlobalService({
      userId: req.userId,
      q,
      limit: Number(req.query.limit || 20),
    });

    return res.json({
      status: "success",
      data: {
        query: q,
        results,
      },
    });
  } catch (err) {
    next(err);
  }
};
