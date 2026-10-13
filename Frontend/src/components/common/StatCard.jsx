import React from "react";
import { motion } from "framer-motion";

export const StatCard = ({ title, value, icon: Icon, change, trend = "up", subtitle, color = "orange" }) => {
  const colorStyles = {
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      glow: "from-orange-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "from-emerald-500/10",
    },
    sky: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/20",
      glow: "from-sky-500/10",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      glow: "from-purple-500/10",
    },
  };

  const style = colorStyles[color] || colorStyles.orange;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden bg-[#182234] border border-slate-750/70 hover:border-slate-600 rounded-2xl p-5 shadow-lg shadow-black/20 transition-all"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} to-transparent rounded-bl-full pointer-events-none opacity-40`} />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h4>
          
          {(change || subtitle) && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              {change && (
                <span
                  className={`font-semibold px-1.5 py-0.5 rounded ${
                    trend === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {trend === "up" ? "↑" : "↓"} {change}
                </span>
              )}
              {subtitle && <span className="text-slate-400">{subtitle}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-xl ${style.bg} ${style.text} border ${style.border} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;

