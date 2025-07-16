import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#232323] border-b border-[#232323] flex items-center justify-between px-8 py-2">
      {/* Left: Logo and tagline */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <div className="flex flex-col items-center mr-2">
          <span className="text-white font-extrabold text-3xl leading-none">USTV<br/>NOW</span>
          <div className="flex mt-1 space-x-1">
            <span className="w-4 h-1 bg-red-500 inline-block rounded"></span>
            <span className="w-4 h-1 bg-yellow-400 inline-block rounded"></span>
            <span className="w-4 h-1 bg-green-500 inline-block rounded"></span>
            <span className="w-4 h-1 bg-blue-500 inline-block rounded"></span>
          </div>
        </div>
        <div className="flex flex-col text-xs text-gray-300 leading-tight">
          <span>TV for US Military</span>
          <span>and US citizens</span>
          <span>abroad.</span>
        </div>
      </div>

      {/* Center: Navigation links */}
      <div className="flex-1 flex items-center justify-center gap-8">
        <a href="#" className="text-gray-300 hover:text-white text-lg">Home</a>
        <a href="#" className="text-gray-300 hover:text-white text-lg">Live TV</a>
        <a href="#" className="text-white font-semibold text-lg border-b-2 border-white pb-1">TV Guide</a>
        <a href="#" className="text-gray-300 hover:text-white text-lg">Free TV Guide</a>
        <a href="#" className="text-gray-300 hover:text-white text-lg">Movies</a>
      </div>

      {/* Right: Buttons and links */}
      <div className="flex items-center gap-4 min-w-[320px] justify-end">
        <button className="bg-[#07a6df] text-white px-6 py-2 rounded-none font-medium text-lg">Plans</button>
        <div className="flex items-center gap-1 text-white text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
          <span className="text-gray-300 text-base">Search</span>
        </div>
        <span className="text-gray-400 text-lg mx-2">|</span>
        <a href="#" className="text-gray-300 hover:text-white text-lg">Sign In</a>
        <button className="bg-[#07a6df] text-white px-6 py-2 rounded-none font-medium text-lg ml-2">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
