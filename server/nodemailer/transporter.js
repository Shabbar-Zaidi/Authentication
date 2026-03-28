import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ only for testing
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Nodemailer transporter is ready to send emails");
  } catch (error) {
    console.error("Error verifying Nodemailer transporter:", error);
  }
};
verifyTransporter();

export { transporter };
