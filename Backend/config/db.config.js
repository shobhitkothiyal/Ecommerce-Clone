import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URL=process.env.MONGO_URL
console.log("mongo",MONGO_URL)
export const DBConnect = async()=>{
    try{
        await mongoose.connect(MONGO_URL)
        console.log("Mongo db connect successfully", MONGO_URL)
    } catch(err){
        console.log("Connection failed", err)
    }
}