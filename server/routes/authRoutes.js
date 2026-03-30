import express from "express";
import passport from "passport";
import { continuewithlogin, continuewithfb, loginUser, signupUser, verifyEmail, forgotPassword, resetPassword, checkAuth, resendVerification } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// Auth routes
authRouter.post("/google", continuewithlogin);
authRouter.post("/login", loginUser);
authRouter.post("/signup", signupUser);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/check-auth", verifyToken, checkAuth);
authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Callback after Facebook login
authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5173/register",
  }),
  continuewithfb,
);

export default authRouter;
