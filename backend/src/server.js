const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const standardRoutes = require("./routes/standardRoutes");
const authRoutes = require("./routes/authRoutes");
const adminStandardRoutes = require(
  "./routes/adminStandardRoutes"
);

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

// Global middleware
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

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RenewCred CMS API is running",
  });
});

// API routes
app.use("/api/v1/standards", standardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/standards", adminStandardRoutes);


// Error handling - MUST remain after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RenewCred CMS API running on port ${PORT}`);
});