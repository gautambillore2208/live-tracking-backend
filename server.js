// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import adminRoutes from "./routes/admin.routes.js";
// import connectDB from './config/db.config.js';
// import authRoutes from './routes/auth.routes.js';
// import socketHandler from './socket/socket.handler.js';

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use("/api/admin", adminRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'Server chal raha hai ✅' });
// });

// socketHandler(io);

// connectDB().then(() => {
//   httpServer.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT} ✅`);
//   });
// });


// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
// import cors from "cors";
// import adminRoutes from "./src/routes/admin.routes.js";
// import connectDB from "./src/config/db.config.js";
// import authRoutes from "./src/routes/auth.routes.js";
// import socketHandler from "./src/socket/socket.handler.js";

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   process.env.FRONTEND_URL,
// ].filter(Boolean);

// const io = new Server(httpServer, {
//   cors: {
//     origin: allowedOrigins.length ? allowedOrigins : "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.use(
//   cors({
//     origin: allowedOrigins.length ? allowedOrigins : "*",
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Server chal raha hai ✅" });
// });

// app.get("/health", (req, res) => {
//   res.status(200).json({ success: true, message: "Backend is healthy ✅" });
// });

// socketHandler(io);

// const PORT = process.env.PORT || 5000;

// connectDB()
//   .then(() => {
//     httpServer.listen(PORT, () => {
//       console.log(`Server running on port ${PORT} ✅`);
//     });
//   })
//   .catch((error) => {
//     console.error("Database connection failed ❌", error);
//     process.exit(1);
//   });





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
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors(corsOptions));
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
    });
  })
  .catch((error) => {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  });