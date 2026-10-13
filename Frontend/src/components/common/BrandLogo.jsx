import React from "react";
import { Link } from "react-router-dom";
import { FaWrench, FaCarSide } from "react-icons/fa";

export const BrandLogo = ({ size = "md", link = "/", showSubtitle = true }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const Content = (
    <div className="flex items-center gap-3 select-none group">
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 text-white transition-transform group-hover:scale-105 ${
          isSm ? "w-8 h-8 rounded-lg" : isLg ? "w-12 h-12 rounded-2xl" : "w-10 h-10"
        }`}
      >
        <FaCarSide className={isSm ? "w-4 h-4" : isLg ? "w-6 h-6" : "w-5 h-5"} />
        <span className="absolute -bottom-1 -right-1 bg-slate-900 border border-orange-500/60 p-0.5 rounded-full text-[10px]">
          <FaWrench className="w-2.5 h-2.5 text-orange-400" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-white ${
              isSm ? "text-base" : isLg ? "text-2xl" : "text-xl"
            }`}
          >
            Auto<span className="text-orange-500">Serve</span>
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`font-medium tracking-wider text-slate-400 uppercase ${
              isSm ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Vehicle Service Portal
          </p>
        )}
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{Content}</Link>;
  }

  return Content;
};

export default BrandLogo;

