import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import ProjectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';

connectDB();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust the client URL as needed
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoutes);
app.use('/project', ProjectRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the SOEN Backend API');
});

export default app;

