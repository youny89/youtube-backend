import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    
    userId: {  type: mongoose.Types.ObjectId, required: true, ref:"User"},
    videoId: {  type: mongoose.Types.ObjectId, required: true, ref:"Video" },
    text: { type: String, required: true },
    likes: { type: [String], default:[] },
    disLikes: { type: [String], default:[] }

},{timestamps: true});

export default mongoose.model('Comment', CommentSchema)