import asyncHandler from "express-async-handler"
import Video from "../models/Video.js";
import User from "../models/User.js";

/**
    @GET /api/subscribe/videos
    @private
    @desc Get videos that logged user in subscribed 
 */

export const getSubscribedVideos = asyncHandler (async(req,res) => {

    const subscribedUsers = req.user.subscribedUsers;
    const videos = await Video.find({creatorId : { $in: subscribedUsers}}).sort({createdAt:'-1'});
    res.json(videos);
})

/**
    @GET /api/subscribe/users
    @private
    @desc Get users that logged user in subscribed 
 */
export const getSubscribedUsers = asyncHandler (async(req,res) => {
    const users = await User.findById(req.user._id).populate('subscribedUsers')
    const {subscribedUsers} = users;
    res.json(subscribedUsers);
})
