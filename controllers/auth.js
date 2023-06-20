import asyncHandler from "express-async-handler";
import errorResponse from "../utils/errorResponse.js";

// @route POST /api/auth/login 
export const login = asyncHandler(async(req,res) => {
    // @TODO delete error response.
    throw errorResponse('데이터를 찾을수 없습니다.',404);
    // res.json('login')
})

// @route POST /api/auth/signup 
export const signup = asyncHandler(async(req,res) => {
    res.json('signup')
})
// @route POST /api/auth/logout 
export const logout = asyncHandler(async(req,res) => {
    res.json('logout')
})