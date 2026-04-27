import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';

const app = express();
const server = http.createServer(app);

dotenv.config(); 
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Game Server Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});