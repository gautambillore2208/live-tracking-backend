import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from "./routes/admin.routes.js";
import connectDB from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import socketHandler from './socket/socket.handler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server chal raha hai ✅' });
});

socketHandler(io);

connectDB().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} ✅`);
  });
});