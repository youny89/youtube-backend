import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`몽고DB 연결: ${conn.connection.host}`)
    } catch (error) {
        console.log('에러: ', error.message)
        process.exit(1)
    }
}

export default connectDB;