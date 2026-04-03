import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./src/routes/admin.routes.js";
import connectDB from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.routes.js";
import socketHandler from "./src/socket/socket.handler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://admin-iqtn.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Postman / mobile apps / same-origin requests me origin undefined ho sakta hai
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// CORS middleware only once
app.use(cors(corsOptions));

// Preflight requests handle karne ke liye
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server chal raha hai ✅" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is healthy ✅" });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
      console.log("Allowed origins:", allowedOrigins);
    });
  })
  .catch((error) => {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  });