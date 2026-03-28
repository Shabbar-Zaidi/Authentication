import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { useAppContext } from "../context/AppContext.jsx";
import { getProfile } from "../api/api.js";

const Profile = () => {
  const { profileData, setProfileData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        console.log("Protected data:", res.data.user);
        setProfileData(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    return () => fetchProfile();
  }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, [setUser]);

  const deleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token present - cannot delete profile");
        return;
      }
      const res = await axios.delete("http://localhost:8080/profile/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success === true) {
        console.log("Profile deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        console.error("Error deleting profile:", res.data);
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
    }
  };

  const editProfile = () => {
    alert("Edit profile functionality to be implemented.");
    navigate("/profile");
  };

  return (
    <>
      <div className="bg-[rgb(19,22,25)] text-white h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
      {/* {!profileData ? (
        <div className="bg-[rgb(19,22,25)] text-white h-screen flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      ) : ( */}
      {/* <div className="bg-[rgb(19,22,25)] text-white h-screen">
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <img className="w-50 h-50 rounded-full" src={profileData.picture ? profileData.picture : assets.profile_sidebar} alt="" />
          <h2>Welcome, {profileData.name}</h2>
          <p>Email: {profileData.email}</p>
          <p>First Name: {profileData.name.split(" ")[0]}</p>
          <p>Last Name: {profileData.name.split(" ")[1]}</p>
          <p>Auth Provider: {profileData.authProvider}</p>
          <div>
            <button onClick={deleteProfile} className="bg-red-600 px-2 py-3 mx-2 rounded-lg cursor-pointer">
              Delete
            </button>
            <button onClick={editProfile} className="bg-blue-600 px-2 py-3 mx-2 rounded-lg">
              Edit
            </button>
          </div>
        </div>
      </div> */}
      {/* )} */}
    </>
  );
};

export default Profile;
