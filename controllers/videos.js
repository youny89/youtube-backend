import asyncHandler from "express-async-handler"
import errorResponse from "../utils/errorResponse.js";
import Video from "../models/Video.js"
import mongoose from "mongoose"

const { ObjectId } = mongoose.Types;

/**
 * @route POST /api/video
 * @private
 */
export const create = asyncHandler(async(req,res) => {
    const newVideo = new Video({
        ...req.body,
        creator: {
            name:req.user.name,
            avatar:req.user.avatar
        },
        creatorId: req.user._id
    });

    await newVideo.save();

    res.json(newVideo)
})

/**
 * @route PUT /api/video/:id
 */
export const update = asyncHandler(async(req,res) => {
    const video = await Video.findById(req.params.id);
    if(!video) throw errorResponse('비디오를 찾을수 없습니다.',404);
    if(video.creatorId.toString() !== req.user._id.toString()) throw errorResponse('해당 비디오에 접근 할수 없습니다.',403)

    const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set : { ...req.body}},
        {new: true }
    )
    res.status(200).json(updatedVideo);

})

/**
 * @route DELETE /api/video/:id
 */
export const deleteVideo = asyncHandler(async(req,res) => {
    const video = await Video.findById(req.params.id);
    if(!video) throw errorResponse('비디오를 찾을수 없습니다.',404);
    if(video.creatorId.toString() !== req.user._id.toString()) throw errorResponse('해당 비디오에 접근 할수 없습니다.',403)

    await Video.findByIdAndDelete(req.params.id)
    res.status(200).json('비디오 삭제 완료.');

})

/**
 * @routes PUT /api/video/:id/like
 * @private
 */
export const like = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);
    
    const video = await Video.findById(req.params.id);

    if(video.likes.includes(req.user._id)){
        await video.updateOne({$pull : { likes : req.user._id}})
    } else {
        await video.updateOne({$addToSet : { likes : req.user._id}})
    }
    res.json('좋아요 완료.')
});

/**
 * @routes PUT /api/video/:id/dislike
 * @private
 */
export const dislike = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);

    const video = await Video.findById(req.params.id);

    if(video.likes.includes(req.user._id)){
        await video.updateOne({$pull : { disLikes : req.user._id}})
    } else {
        await video.updateOne({$addToSet : { disLikes : req.user._id}})
    }

    res.json('싫어요 완료.')
}) 


/**
 * @routes GET /api/video/:id
 * @private
 */
export const getVideoById = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);

    const video = await Video.findById(req.params.id);
    res.json(video);
}) 

/**
 * @routes PUT /api/video/:id/views
 * @private
 */
export const addViews = asyncHandler(async(req,res) => {
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid) throw errorResponse('잘못된 접근 방식이빈다.',400);

    await Video.findByIdAndUpdate(
        req.params.id,
        { $inc : { views : 1}}
    );

    res.json('비디오 조회수 추가 완료.');
}) 


/**
 * @routes GET /api/video/find/random
 * @private
 */
export const random = asyncHandler(async(req,res) => {
    const videos = await Video.aggregate([
        { $sample : { size: 10 }},
        // { $sort : { views: -1}}
    ])

    res.json(videos);
}) 

/**
 * @routes GET /api/video/find/trend
 * @private
 */
export const trend = asyncHandler(async(req,res) => {
    const videos = await Video.find().sort({views:-1});
    res.json(videos);
}) 



/**
 * @routes GET /api/video/find/tags
 * @private
 */
export const tags = asyncHandler(async(req,res) => {
    const tags = req.query.tags ? req.query.tags.split(',') : []; 
    const videos = await Video.find({ tags: { $in: tags }}).limit(10);
    res.json(videos);

}) 

/**
 * @routes GET /api/video/find/search
 * @private
 */
export const search = asyncHandler(async(req,res) => {
    const search = req.query.search ? req.query.search : false; 
    if(!search) return res.json([]);

    const videos = await Video.find(
        { title : { $regex: search , $options: "i"}}
    ).limit(20)

    res.json(videos);
}) 


/**
 * @routes GET /api/video/subscribed
 * @private
 */
export const getSubscribedUsersVideos = asyncHandler(async(req,res) => {
    const subscribedUsers = req.user.subscribedUsers;
    // const videos = await Promise.all(subscribedUsers.map(async (userId) => {
    //     return await Video.find({creatorId: userId})
    // })
    // ) 
    const videos = await Video.find({creatorId : { $in: subscribedUsers}}).sort({createdAt:'-1'});
    res.json(videos);
}) 


