import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const generateToken = (userId)=>{
    const token = jwt.sign({userId},JWT_SECRET_KEY,{expiresIn:'48h'})
    return token;
}

export default generateToken