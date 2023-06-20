import dotenv from "dotenv"
dotenv.config({path:'./config/.env'});
import express from "express"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.js";

import { notFound, errorHandler } from "./middleware/error.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT , ()=> console.log('서버 시작.'))