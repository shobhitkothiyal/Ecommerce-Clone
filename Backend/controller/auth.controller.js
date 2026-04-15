import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jwt for token generation
import * as authService from '../services/auth.service.js';
import generateToken from '../config/jwtprovider.js';
import transporter from '../config/transporter.js';

//controller for user registration
export const register = async(req,res) =>{
     try{
        const user = await authService.registerUser(req.body); // call register service
        const jwt =  generateToken(user._id); // generate token after register
       res.status(200).json({jwt, message:"Register Successfull"}); // response with jwt token
     } catch(err){
       
        res.status(400).json({error:err.message}); 
     }
};

//conttroller for user login

export const login = async(req,res)=>{
   try{
      const {email,password} = req.body;  // get email and password from request body
      const user = await authService.getUserByEmail(email);  // call service to get user by email
      if(!user){
         return res.status(400).json({message:"User Is Not Registered With This Email "});
      }
      const isPassword = await bcrypt.compare(password, user.password); // compare password

      if(!isPassword){ // if password not match
         return res.status(400).json({message:"Invalid Password "});  // response invalid password
      }

      const jwt_token = await generateToken(user._id); // generate token after login
      return res.status(200).json({jwt_token, message:"Login Successfull"}); // response with jwt token

   }catch(err){
      res.status(400).json(err.message);
   }
};

export const testEmail = async(req,res)=>{
   try{
      const {email} = req.body;
      const sendEmail = {
         from: process.env.SMTP_USER,
         to: email,
         subject: "TO Verify contact",
         text:"Hello! This Is a Test email for NodeMailer",
         html: `
         <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;
                     background:#f4f6f8;padding:20px;border-radius:10px;">
            
            <div style="background:#ffffff;padding:30px;border-radius:10px;
                        box-shadow:0 4px 10px rgba(0,0,0,0.1);">

               <h1 style="color:#2563eb;text-align:center;margin-bottom:10px;">
               👋 Welcome to Our Platform
               </h1>

               <p style="font-size:16px;color:#333;text-align:center;">
               Hi there! We’re excited to have you on board.
               </p>

               <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

               <p style="font-size:15px;color:#555;line-height:1.6;">
               This email is sent to verify your contact information.
               Please confirm that this email address belongs to you.
               </p>

            </div>
         </div>
         `

      }
      const mail = await transporter.sendMail(sendEmail);
      res.status(200).json({message:"Mail Sended Successfully",mail});

   }catch(err){
      console.log("Error",err.message)
      res.status(400).json({message:"failed to send message",error:err.message});
   }
}