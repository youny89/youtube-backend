import crypto from "crypto"
import asyncHandler from "express-async-handler";

import errorResponse from "../utils/errorResponse.js";
import User from "../models/User.js"
import sendEmail from "../utils/sendEmail.js";

// @route POST /api/auth/social/:provider
export const socialLogin = asyncHandler(async(req,res)=>{
    const { provider } = req.params;
    if (!provider) throw errorResponse('No provoider', 400);
    if(!req.body.email) throw errorResponse('missing required field.', 400);

    let user = await User.findOne({email: req.body.email});
    if(user) {
        if(provider === 'google') user.signInGoogle = true;
        await user.save();
    }else{
        user = await User.create({
            signInGoogle : provider === 'google' ? true:false,
            ...req.body
        });
    }

    const accessToken = user.generateJwtToken()
    const options = {
        expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE ),
        httpOnly: true,
        secure : process.env.NODE_ENV === 'productions' ? true : false
    }

    res
        .cookie('token', accessToken, options)
        .json(user);

})

// @route POST /api/auth/login 
export const login = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password) throw errorResponse('모든 데이터 필드를 입력해주세요',400)

    const user = await User.findOne({email}).select('+password')

    if(!user) throw errorResponse('이메일 혹은 비밀번호가 일치하지 않습니다.',400)
    if(user && !user.password) throw errorResponse('이미 존재하는 계정입니다. 로그인 후 연동 해주세요.',400)
    
    const isMatched = await user.comparePassword(password) 
    if(!isMatched) throw errorResponse('이메일 혹은 비밀번호가 일치하지 않습니다.',400)
    

    await user.save({ validateBeforeSave: false });

    const jwtToken = user.generateJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24), // 30일
        httpOnly: true,
        secure: process.env.NODE_ENV==='production' ? true:false
    }

    const { password:_, ...others} = user._doc;

    res.status(200)
        .cookie('token',jwtToken, options)
        .json(others)
})

// @route POST /api/auth/signup 
export const signup = asyncHandler(async(req,res) => {
    const { name, email, password} = req.body;
    if(!email || !password) throw errorResponse('모든 데이터 필드를 입력해주세요',400)
    if(await User.findOne({email}) ) throw  errorResponse('이미 존재하는 이메일입니다.',400)

    const user = await User.create({name, email, password});

    const confirmEmailToken = user.generateEmailConfirmToken();

    const confirmUrl = `${req.protocol}://${req.get('host')}/api/auth/confirm?token=${confirmEmailToken}`
    const message = '안녕하세요. 회원가입 확인을 위한 이메일입니다. 다음의 링크을 클릭하여 인증을 완료해주세요.' + confirmUrl

    //@TODO: send email.
    console.log(` sending email with message : ...`, message)
    await sendEmail({
        email:user.email,
        subject:'회원가입 메일 인증.',
        message
    })

    await user.save({ validateBeforeSave: false });

    const jwtToken = user.generateJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24), // 30일
        httpOnly: true,
        secure: process.env.NODE_ENV==='production' ? true:false
    }
    const { password:_, ...others} = user._doc;

    res.status(200)
    .cookie('token',jwtToken, options)
    .json(others)
})

// @route POST /api/auth/logout 
export const logout = asyncHandler(async(req,res) => {
    res.clearCookie('token')
        .status(200)
        .json('로그아웃');
    
})

// @route POST /api/auth/logout 
export const confirmEmail = asyncHandler(async(req,res) => {
    const { token } = req.query

    if(!token) throw new Error(errorResponse('올바른 토큰이 아닙니다.',400));
    const splitedToken = token.split('.')[0];

    const confirmEmailToken = crypto.createHash('sha256')
        .update(splitedToken)
        .digest('hex');

    const user = await User.findOne({
        confirmEmailToken,
        isEmailConfirmed: false
    }).select('+confirmEmailToken');

    if(!user) throw new Error(errorResponse('올바른 토큰이 아닙니다.',400));

    user.isEmailConfirmed = true;
    user.confirmEmailToken=undefined;

    user.save({validateBeforeSave: false});

    res.json({message:'이메일 인증 완료.'})
})