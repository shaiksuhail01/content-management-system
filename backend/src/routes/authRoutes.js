const express = require("express");

const {
  login,
  getCurrentAdmin,
  logout,
} = require("../controllers/authController");

const protectRoute = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  loginSchema,
} = require("../validators/authValidator");

const router = express.Router();

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  protectRoute,
  getCurrentAdmin
);

router.post(
  "/logout",
  protectRoute,
  logout
);

module.exports = router;