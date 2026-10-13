import React from "react";

export const Badge = ({ children, variant = "default", size = "sm" }) => {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs font-medium",
    sm: "px-2.5 py-1 text-xs font-semibold",
    md: "px-3 py-1.5 text-sm font-semibold",
  };

  const variantMap = {
    default: "bg-slate-800 text-slate-300 border border-slate-700",
    primary: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    info: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  };

  // Auto-detect variant based on common status terms
  let resolvedVariant = variant;
  if (typeof children === "string") {
    const text = children.toLowerCase();
    if (["completed", "active", "approved", "available", "paid", "published"].includes(text)) {
      resolvedVariant = "success";
    } else if (["in progress", "pending", "busy", "assigned"].includes(text)) {
      resolvedVariant = "warning";
    } else if (["cancelled", "rejected", "inactive", "on leave"].includes(text)) {
      resolvedVariant = "danger";
    } else if (["accepted"].includes(text)) {
      resolvedVariant = "info";
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-all ${
        sizeClasses[size] || sizeClasses.sm
      } ${variantMap[resolvedVariant] || variantMap.default}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};

export default Badge;

