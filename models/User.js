import mongoose from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:[2,'최소 2글자 이상 입력해주세요']
    },
    email:{
        type:String,
        required:['이메일을 입력해주세요'],
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '올바른 이메일 형식으로 작성해 주세요.',
        ]
    },
    password:{
        type:String,
        select:false
    },
    signInGoogle:{
        type:Boolean,
        default:false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: {
        type:String,
        select:false
    },
    isEmailConfirmed: {
        type:Boolean,
        default: false
    },

    avatar : String,
    numberOfSubscribers : {
        type:Number,
        defalut:0
    },
    subscribedUsers:[{ type: mongoose.Types.ObjectId, ref:"User" }]

},{ timestamps: true});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (inputPassword){
    return await bcrypt.compare(inputPassword, this.password);
}

UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

UserSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    const hashedResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex')
    
    this.resetPasswordToken = hashedResetToken;
    this.resetPasswordExpire = Date.now() + 1000 * 60 * 10

    return resetToken;
}

UserSchema.methods.generateEmailConfirmToken = function (next) {
    const confirmToken = crypto.randomBytes(20).toString('hex');

    const hashedConfirmToken = crypto.createHash('sha256')
        .update(confirmToken)
        .digest('hex');

    this.confirmEmailToken = hashedConfirmToken;


    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmToken}.${confirmTokenExtend}`;

    return confirmTokenCombined;

}

export default mongoose.model('User',UserSchema);