const express = require("express");

const {
  getAdminStandards,
  getAdminStandardById,
  createStandard,
  updateStandard,
  deleteStandard,

  addVersion,
  updateVersion,
  deleteVersion,

  addSection,
  updateSection,
  deleteSection,
} = require("../controllers/adminStandardController");

const protectRoute = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const {
  createStandardSchema,
  updateStandardSchema,

  versionSchema,
  updateVersionSchema,

  sectionSchema,
  updateSectionSchema,
} = require("../validators/standardValidator");

const router = express.Router();

// Protect every route below this line
router.use(protectRoute);

// Standards
router.get("/", getAdminStandards);

router.post(
  "/",
  validate(createStandardSchema),
  createStandard
);

router.get(
  "/:id",
  getAdminStandardById
);

router.put(
  "/:id",
  validate(updateStandardSchema),
  updateStandard
);

router.delete(
  "/:id",
  deleteStandard
);

// Versions
router.post(
  "/:id/versions",
  validate(versionSchema),
  addVersion
);

router.put(
  "/:id/versions/:versionId",
  validate(updateVersionSchema),
  updateVersion
);

router.delete(
  "/:id/versions/:versionId",
  deleteVersion
);

// Sections
router.post(
  "/:id/versions/:versionId/sections",
  validate(sectionSchema),
  addSection
);

router.put(
  "/:id/versions/:versionId/sections/:sectionId",
  validate(updateSectionSchema),
  updateSection
);

router.delete(
  "/:id/versions/:versionId/sections/:sectionId",
  deleteSection
);

module.exports = router;