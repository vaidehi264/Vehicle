import React from "react";
import { Link } from "react-router-dom";
import { FaCarCrash, FaHome } from "react-icons/fa";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/20">
        <FaCarCrash className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-3">
        404 Error — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Off the Beaten Path
      </h1>

      <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on the right road.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2"
      >
        <FaHome className="w-3.5 h-3.5" /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFound;

