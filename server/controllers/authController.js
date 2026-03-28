import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../lib/generateToken.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../nodemailer/emails.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const continuewithlogin = async (req, res) => {
  try {
    console.log("continuewithlogin: incoming body:", req.body);
    const { user } = req.body;
    if (!user) {
      console.warn("continuewithlogin: missing user in request body");
      return res.status(400).json({ message: "User data missing" });
    }

    let existingUser = await User.findOne({ googleId: user.sub });
    if (!existingUser) {
      existingUser = new User({
        name: user.name,
        email: user.email,
        googleId: user.sub,
        picture: user.picture,
        authProvider: "google",
      });
      await existingUser.save();
    }

    const token = generateToken(existingUser._id);
    // Send response with consistent shape
    res.status(201).json({ success: true, token, user: { name: existingUser.name, email: existingUser.email, id: existingUser._id } });
  } catch (err) {
    console.error("continuewithlogin error:", err && err.stack ? err.stack : err);
    res.status(401).json({ error: "Invalid Google token", details: err && err.message });
  }
};

// http://localhost:8080/auth/signup
export const signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    // console.log("userAlreadyExists", userAlreadyExists);

    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code

    const user = new User({
      email,
      password: hashedPassword,
      name,
      authProvider: "email",
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    const token = generateToken(user._id);

    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// http://localhost:8080/auth/verify-email
export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  console.log("verificationCode", verificationCode);

  try {
    const user = await User.findOne({
      verificationCode: verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// http://localhost:8080/auth/resend-verification
export const resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

    // generate new code and expiry
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // send email (re-use existing helper)
    await sendVerificationEmail(user.email, verificationCode);

    return res.status(200).json({ success: true, message: "Verification code resent" });
  } catch (error) {
    console.error("resendVerification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// http://localhost:8080/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const logout = async (req, res) => {
//   res.clearCookie("token");
//   res.status(200).json({ success: true, message: "Logged out successfully" });
// };

// http://localhost:8080/auth/forgot-password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex"); // 40 characters -> "9b1de3f4e5c6a7b8c9d0e1f2a3b4c5d6e7f8g9h0"
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordCode = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// http://localhost:8080/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    // Support token being passed either as URL param (/reset-password/:token)
    // or in the request body ({ token }) for clients that post the token in the payload.
    const token = req.params.token || req.body.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required" });
    }

    // Data must be send and recieve via encryption model

    const user = await User.findOne({
      resetPasswordCode: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const continuewithfb = async (req, res) => {
  try {
    // Create JWT token
    const token = generateToken(req.user._id);
    // send response with token
    // res.status(200).json({ success: true, token, user: { name: req.user.name, email: req.user.email, id: req.user._id } })
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  } catch (err) {
    console.error("continuewithfacebook error:", err && err.stack ? err.stack : err);
    res.status(401).json({ error: "Invalid Facebook token", message: err && err.message });
  }
};
