import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import Video from "../models/Video.js";
import errorResponse from "../utils/errorResponse.js";
import Comment from "../models/Comment.js";

const {ObjectId} = mongoose.Types;

// @route POST /api/comments/:videoId
export const addComment = asyncHandler(async(req,res) => {
    if(!ObjectId.isValid(req.params.videoId)) throw errorResponse('Not fonud',404);
    const video = await Video.findById(req.params.videoId);    
    if(!video) throw errorResponse('Not fonud',404);

    const newComment = await Comment.create({
        userId: req.user._id,
        videoId: req.params.videoId,
        text:req.body.text
    })

    res.status(200).json(newComment);
});


// @route GET /api/comments/:videoId
export const getComments = asyncHandler(async(req,res) => {
    if(!ObjectId.isValid(req.params.videoId)) throw errorResponse('Not fonud',404);
    const video = await Video.findById(req.params.videoId);    
    if(!video) throw errorResponse('Not fonud',404);

    const totalNumber = await Comment.find({videoId:req.params.videoId}).countDocuments()
    const comments = await Comment.find({videoId:req.params.videoId}).populate('userId','name email avatar').limit(20);

    res.status(200).json({totalNumber,comments});

});


//@route DELETE /api/comment/:commentId
export const deleteComment = asyncHandler(async(req,res) => {
    console.log('[ deleteComment ]')
    if(!ObjectId.isValid(req.params.commentId)) throw errorResponse('not found',404);

    const comment = await Comment.findById(req.params.commentId);
    if(!comment) throw errorResponse('not found',404);
    if(comment.userId.toString() !== req.user._id.toString()) throw errorResponse('접근 권한이 없습니다.',403);

    await comment.deleteOne();
    // const results = await Comment.findOneAndRemove({
    //     _id: req.params.commentId,
    //     userId : req.user._id
    // });
    // if(!results) throw errorResponse('접근 권한이 없습니다.',403)

    res.json('댓글 삭제 완료.');
});


//@route PUT /api/comment/:commentId/like
export const addLike = asyncHandler(async (req,res) => {
    if(!ObjectId.isValid(req.params.commentId)) throw errorResponse('Not found',404);
    const comment = await Comment.findById(req.params.commentId)
    if(!comment) throw errorResponse('Not Found',404);

    if(comment.likes?.includes(req.user?._id)){
        await comment.updateOne({$pull : { likes: req.user._id }})
    } else {
        await comment.updateOne({$addToSet : { likes: req.user._id }})
    }
    res.status(200).json('댓글 좋아요.')
});

//@route PUT /api/commenet/:commentId/dislike
export const addDisLike = asyncHandler(async (req,res) => {
    if(!ObjectId.isValid(req.params.commentId)) throw errorResponse('Not found',404);
    const comment = await Comment.findById(req.params.commentId)

    if(comment.disLikes.includes(req.user._id)){
        await comment.updateOne({$pull : { disLikes: req.user._id }})
    } else {
        await comment.updateOne({$addToSet : { disLikes: req.user._id }})
    }
    res.status(200).json('댓글 싫어요.')

});