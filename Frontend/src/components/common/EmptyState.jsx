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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#182234]/50 border border-dashed border-slate-700/80 rounded-2xl my-4">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <Icon className="w-8 h-8 opacity-75" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

