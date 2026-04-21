import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import {createClient} from 'redis';
import userRoutes from './routes/user.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import cors from 'cors';

dotenv.config();

connectDB();

connectRabbitMQ();

export const redisClient = createClient({
    url: process.env.REDIS_URL!,
});

redisClient.connect().then(() =>console.log('Connected to Redis')).catch((err) => {
    console.error('Error connecting to Redis:', err);
    process.exit(1);
});


const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://10.38.22.180:8080",   // your actual frontend IP
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1", userRoutes); 

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});