const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      process.env.ADMIN_FRONTEND_URL,
      process.env.PUBLIC_FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RenewCred CMS API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RenewCred CMS API running on port ${PORT}`);
});