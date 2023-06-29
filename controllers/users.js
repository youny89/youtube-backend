import mongoose from 'mongoose'
import asyncHandler from "express-async-handler"
import errorResponse from "../utils/errorResponse.js"
import User from '../models/User.js'
import Video from '../models/Video.js'

const { ObjectId } = mongoose.Types;

/**
 * @routes GET /api/user/me
 * @private
 */
export const getMe = asyncHandler(async(req,res) => {
    res.status(200).json({...req.user._doc});
})

/**
 * @routes GET /api/user/me
 * @public
 */
export const getUserbyId = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);

    const user = await User.findById(req.params.id);
    if(!user)  throw errorResponse('존재하지 않는 유저입니다.',404);
    
    res.status(200).json(user);
})

/**
 * @routes put /api/user
 * @private
 */
export const updateDetail = asyncHandler(async(req,res) => {
    const { name, description, email } = req.body;
    if(!description && !name && !email ) throw errorResponse('데이터를 입력해주세요',400);
    const checkEmail = await User.findOne({email});
    if(checkEmail) throw errorResponse('이미 존재하는 이메일 입니다.',400);

    if(description) req.user.description = description;
    if(name) req.user.name = name;
    if(email) req.user.email = email;
    
    const updatedUser = await req.user.save()
    res.json(updatedUser)
})
/**
 * @routes put /api/user/avatar
 * @private
 */
export const updateAvatar = asyncHandler(async(req,res) => {
    const {avatarUrl} = req.body;
    if(!avatarUrl) throw errorResponse('데이터를 입력해주세요',400);

    req.user.avatar = avatarUrl;
    await req.user.save()
    
    //TODO: 해당 유저 비디오 찾아서 avatar 업데이트!
    await Video.findOneAndUpdate(
        { creatorId: req.user._id },
        { $set : { "creator.avatar": avatarUrl }}
    )
    res.json('updated.')
})

/**
 * @routes DELETE /api/user
 * @private
*/
export const deleteUser = asyncHandler(async(req,res) => {
    await User.findByIdAndRemove(req.user._id);
    res.json({message:'유저 삭제 완료.'});
})

/**
 * @routes PUT /api/user/subscribe/:id
 * @private
 * 
 */
export const subscribe = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);
    
    await User.findByIdAndUpdate(req.user._id,{
        $push : { subscribedUsers : req.params.id}
    });
    
    await User.findByIdAndUpdate(req.params.id,{
        $inc : { numberOfSubscribers : 1 }
    });

    res.status(200).json('구독 완료.')
}) 

/**
 * @routes PUT /api/user/unsubscribe/:id
 * @private
 */
export const unSubscribe = asyncHandler(async(req,res) => {
    console.log('[unSubscribe]')
    if(!ObjectId.isValid(req.params.id)) throw errorResponse('잘못된 접근 방식이빈다.',400);

    await User.findByIdAndUpdate(req.user._id,{
        $pull : { subscribedUsers : req.params.id}
    });
    
    await User.findByIdAndUpdate(req.params.id,{
        $inc : { numberOfSubscribers : -1 }
    });
            
 
    res.status(200).json('구독 취소 완료.')
}) 

