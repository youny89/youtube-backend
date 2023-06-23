import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import errorResponse from "../utils/errorResponse.js";

export const protect = asyncHandler(async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) throw errorResponse('로그인 해주세요.',401);
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({message:'존재하지 않는 유저입니다.'});
        req.user = user;
        next()
    } catch (error) {
        throw errorResponse('유효한 토큰이 아닙니다.',401);
    }
})