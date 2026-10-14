import React from "react";
import { FaInbox } from "react-icons/fa";

export const EmptyState = ({
  icon: Icon = FaInbox,
  title = "No data found",
  description = "There are no records matching your request.",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl my-4">
      <div className="w-12 h-12 mb-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
        <Icon className="w-5 h-5 opacity-75" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
