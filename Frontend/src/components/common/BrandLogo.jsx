import React from "react";
import { Link } from "react-router-dom";
import { FaWrench, FaCarSide } from "react-icons/fa";

export const BrandLogo = ({ size = "md", link = "/", showSubtitle = true }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const Content = (
    <div className="flex items-center gap-3 select-none group">
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm shadow-orange-500/20 text-white transition-transform group-hover:scale-105 ${
          isSm ? "w-7 h-7 rounded-lg" : isLg ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"
        }`}
      >
        <FaCarSide className={isSm ? "w-3 h-3" : isLg ? "w-4 h-4" : "w-3.5 h-3.5"} />
        <span className="absolute -bottom-1 -right-1 bg-white border border-orange-500/60 p-0.5 rounded-full text-[9px] shadow-sm">
          <FaWrench className="w-2 h-2 text-orange-600" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-slate-900 ${
              isSm ? "text-base" : isLg ? "text-2xl" : "text-xl"
            }`}
          >
            VV <span className="text-orange-600">Cars</span>
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`font-semibold tracking-wider text-slate-500 uppercase ${
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
