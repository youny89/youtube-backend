import dotenv from "dotenv"
dotenv.config({path:'./config/.env'});
import express from "express"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import videoRouter from "./routes/video.js";
import commentRouter from "./routes/comment.js";
import subscribeRouter from "./routes/subscribe.js";

import { notFound, errorHandler } from "./middleware/error.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/video',videoRouter);
app.use('/api/comment',commentRouter);
app.use('/api/subscribe',subscribeRouter);
app.use(errorHandler);
app.use(notFound);

app.listen(PORT , ()=> console.log('서버 시작.'))