import React from "react";

export const Badge = ({ children, variant = "default", size = "sm" }) => {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs font-medium",
    sm: "px-2.5 py-1 text-xs font-semibold",
    md: "px-3 py-1.5 text-sm font-semibold",
  };

  const variantMap = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    primary: "bg-orange-50 text-orange-700 border border-orange-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
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
