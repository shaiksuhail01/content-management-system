const Standard = require("../models/Standard");

const getStandards = async (req, res, next) => {
  try {
    const standards = await Standard.find({
      status: "published",
    })
      .select("title slug summary icon order")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: standards.length,
      data: standards,
    });
  } catch (error) {
    next(error);
  }
};

const getStandardBySlug = async (req, res, next) => {
  try {
    const standard = await Standard.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    res.status(200).json({
      success: true,
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStandards,
  getStandardBySlug,
};