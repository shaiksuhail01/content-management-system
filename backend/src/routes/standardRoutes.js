const express = require("express");

const {
  getStandards,
  getStandardBySlug,
} = require("../controllers/standardController");

const router = express.Router();

router.get("/", getStandards);

router.get("/:slug", getStandardBySlug);

module.exports = router;