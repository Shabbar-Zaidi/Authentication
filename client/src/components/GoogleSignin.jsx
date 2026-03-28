import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { googleAuth } from "../api/api.js";

function GoogleSignin() {
  const { setUser } = useAppContext();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get Google profile info using the access_token
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        console.log(userInfo.data);

        // Send user info to your backend
        const res = await googleAuth({ user: userInfo.data });

        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        // navigate("/");
        window.location.href = "/";
      } catch (err) {
        console.error(err);
      }
    },
    onError: (err) => console.error("Login Failed:", err),
  });

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <button className="bg-[#1A1D21] text-white px-5 py-2 rounded-lg cursor-pointer" onClick={() => login()}>
        Continue with Google
      </button>
      <div className="App">{/* <GoogleLogin onSuccess={handleSuccess} onError={handleError} /> */}</div>
    </GoogleOAuthProvider>
  );
}

export default GoogleSignin;
