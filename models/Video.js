import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema({
    creatorId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    creator: {
        name:String,
        avatar:String,
    },
    title: {
        type:String,
        required:['제목을 입력해주세요']
    },
    description:{
        type:String,
        required:['설명을 입력해주세요']
    },
    imageUrl:{
        type:String,
        required: ['사진 URL 입력해주세요']
    },
    videoUrl:{
        type:String,
        required: ['비디오 URL 입력해주세요']
    },
    views:{
        type:Number,
        default:0
    },
    tags:{
        type:[String],
        default:[]
    },
    likes: {
        type:[String],
        default:[]
    },
    disLikes: {
        type:[String],
        default:[]
    }
},{timestamps:true});

export default mongoose.model('Video',VideoSchema);