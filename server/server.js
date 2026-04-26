import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

const app = express();
const server = http.createServer(app);

dotenv.config(); 
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Game Server Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});