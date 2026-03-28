import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets.js";

const Sidebar = () => {
  const [isActive, setIsActive] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  const element = document.documentElement;
  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <>
      <div className="w-[22%] flex flex-col bg-white text-black dark:bg-[#131619] dark:text-white justify-center rounded-[20px] m-3">
        <div className="flex items-center p-5 gap-3 border-b border-gray-700">
          <img className="w-[48px] rounded-[20px]" src={assets.logo_sidebar} alt="" />
          <div className="flex flex-col flex-1 gap-1">
            <h1 className="text-[16px] font-semibold">Intellisys</h1>
            <p className="text-[#B6F09C] text-[12px]">12 members</p>
          </div>
          <img src={assets.dropdown_icon} alt="" />
        </div>
        <div className="py-6 px-2 border-b border-gray-700 flex flex-col gap-3">
          <p className="text-[12px] font-semibold px-4 text-[#686B6E]">GENERAL</p>
          <div className="flex items-center gap-4 justify-center px-4 py-3">
            <img className="w-[20px]" src={assets.search_icon} alt="" />
            <p className="text-[14px] flex-1">Search</p>
            <img className="w-[38px]" src={assets.Badge} alt="" />
          </div>
          <div className="flex items-center gap-4 justify-center px-4 py-2">
            <img className="w-[20px]" src={assets.billing_icon} alt="" />
            <p className="text-[14px] flex-1">Billing</p>
          </div>
        </div>

        {/* Projects */}
        <div className="px-2 py-6 flex-1">
          <p className="text-[12px] font-semibold px-4 text-[#686B6E]">PROJECTS</p>
          <div className="flex flex-col items-center gap-2 mt-4">
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-4 py-3 w-full rounded-[8px]"
                style={{ background: "linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)" }}
              >
                <img className="w-[20px]" src={assets.icon_2} alt="" />
                <p className="text-sm flex-1">Orbital Oddysey</p>
              </div>
            ))}
            <div className="flex items-center gap-4 px-4 py-3 w-full rounded-[8px]">
              <img className="w-[20px]" src={assets.plus_icon} alt="" />
              <p className="text-[14px] flex-1 text-[#686B6E]">Add new project</p>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 gap-3 rounded-2xl border-gray-700" style={{ background: "linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)" }}>
          <div className="relative">
            <img className="w-[48px] rounded-[20px]" src={assets.logo_sidebar} alt="" />
            <img className="absolute top-[-10px] right-[-12px] rounded-[10px] border-gray-700" src={assets.green_icon} alt="" />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <h1 className="text-[16px] font-semibold">Ryan Lee</h1>
            <p className="text-[#B6F09C] text-[12px]">Premium</p>
          </div>
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" className="theme-controller" value="synthwave" />

            {/* sun icon */}
            <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          <img src={assets.setting_icon} alt="" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
