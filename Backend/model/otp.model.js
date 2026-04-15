import mongoose from 'mongoose'

export const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    otp:{
        type: String,
        required: true
    },
    otpCreatedAt:{
        type: Date,
        default: Date.now,
        expires: 600
    },
    attempt:{
        type: Number,
        default:0
    }
});
const Otp = mongoose.model("otps",otpSchema);