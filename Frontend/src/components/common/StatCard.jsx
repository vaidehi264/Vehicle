import React from "react";
import { motion } from "framer-motion";

export const StatCard = ({ title, value, icon: Icon, change, trend = "up", subtitle, color = "orange" }) => {
  const colorStyles = {
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      glow: "from-orange-500/5",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      glow: "from-emerald-500/5",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-200",
      glow: "from-sky-500/5",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
      glow: "from-purple-500/5",
    },
  };

  const style = colorStyles[color] || colorStyles.orange;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-sm shadow-slate-200/50 transition-all"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} to-transparent rounded-bl-full pointer-events-none opacity-60`} />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
          
          {(change || subtitle) && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              {change && (
                <span
                  className={`font-semibold px-1.5 py-0.5 rounded ${
                    trend === "up" ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100"
                  }`}
                >
                  {trend === "up" ? "↑" : "↓"} {change}
                </span>
              )}
              {subtitle && <span className="text-slate-500">{subtitle}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.text} border ${style.border} shrink-0`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
