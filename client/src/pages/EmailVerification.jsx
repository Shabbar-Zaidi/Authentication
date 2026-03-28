import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import GoogleSignin from "../components/GoogleSignin.jsx";
import { verifyEmail } from "../api/api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async () => {
    try {
      const res = await verifyEmail(verificationCode);
      console.log("Verification response:", res);
      if (res.data.success) {
        toast.success("Email verified successfully!");
        // Redirect to profile or home page
        // navigate("/");
        window.location.href = "/";
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.log("Error: ", error);
    }
    console.log("Verification code submitted:", verificationCode);
    // You can add API call to verify the code here
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#131619] h-screen w-full text-[#9B9C9E]">
      <img className="w-[52px] h-[52px] m-4" src={assets.logo} alt="" />
      <div className="flex flex-col justify-center px-[112px]">
        <h1 className="text-[52px] text-center">
          Add Verification{" "}
          <span
            className=""
            style={{
              background: "linear-gradient(45deg, #4D62E5 0%, #87DDEE 45.31%, #B6F09C 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              display: "inline-block",
            }}
          >
            Code
          </span>
        </h1>

        <p className="py-3">We've sent a verification code to your email. Please enter the code below to verify your account.</p>

        <div className="flex flex-col gap-2 py-5">
          <input
            onChange={(e) => setVerificationCode(e.target.value)}
            type="text"
            name="verificationCode"
            id="verificationCode"
            className="px-4 py-3 text-white placeholder:text-[#9B9C9E] bg-[#1A1D21] rounded-lg"
            placeholder="Enter verification code"
          />
        </div>
        <button onClick={onSubmitHandler} className="bg-[#B6F09C] w-full px-4 py-2 my-4 rounded-lg text-black cursor-pointer">
          Verify Account
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
