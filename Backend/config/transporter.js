import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
});
console.log("transporter", transporter)

transporter.verify()
  .then(() =>{ console.log("✅ Transporter Verified")})
  .catch((err) =>{ console.log("❌ Transporter Failed:", err.message)});

export default transporter;