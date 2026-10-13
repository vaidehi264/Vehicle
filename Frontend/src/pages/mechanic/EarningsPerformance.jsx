import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import StatCard from "../../components/common/StatCard";
import {
  FaWallet,
  FaRupeeSign,
  FaCheckCircle,
  FaStar,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";

export const EarningsPerformance = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);

  useEffect(() => {
    const allReviews = storageService.getReviews();
    const allBookings = storageService.getBookings();
    const mechId = currentUser?.id || "mech-001";

    setReviews(
      allReviews.filter((r) => r.mechanicId === mechId || r.mechanicName === currentUser?.name)
    );
    setCompletedJobs(
      allBookings.filter(
        (b) =>
          (b.mechanicId === mechId || b.mechanicName === currentUser?.name) &&
          b.status === "Completed"
      )
    );
  }, [currentUser]);

  const thisMonthEarnings = 64200;
  const totalAllTime = 428000;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Earnings & Technician Performance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diagnostic payouts, completed job volume, customer tip incentives, and quality ratings.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          Direct Bank Payout Active
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Earned This Month"
          value={`₹${thisMonthEarnings.toLocaleString()}`}
          icon={FaRupeeSign}
          change="+14.8%"
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Total Lifetime Payout"
          value={`₹${totalAllTime.toLocaleString()}`}
          icon={FaWallet}
          subtitle="Direct deposit to HDFC"
          color="sky"
        />
        <StatCard
          title="Total Completed Repairs"
          value="284 Cars"
          icon={FaCheckCircle}
          change="+18 this month"
          trend="up"
          color="purple"
        />
        <StatCard
          title="Average Customer Score"
          value={`${currentUser?.rating || "4.9"} ★`}
          icon={FaStar}
          subtitle="Top 5% technician across network"
          color="orange"
        />
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Earnings Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Monthly Service Revenue Share</h3>
            <span className="text-xs text-slate-500">75% Mechanic Share Ratio</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: "Engine Overhauls & Diagnostics", earned: 32400, percent: 50 },
              { label: "Periodic Maintenance Service", earned: 18200, percent: 28 },
              { label: "Brake & Hydraulic System Repairs", earned: 11400, percent: 18 },
              { label: "Performance Tuning & Diagnostics", earned: 2200, percent: 4 },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat.label}</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ₹{cat.earned.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs mt-4">
            <span className="text-slate-500">Next Payout Cycle:</span>
            <span className="font-extrabold text-slate-900">1st of Next Month (Est. ₹72,500)</span>
          </div>
        </div>

        {/* Customer Review History */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FaAward className="text-amber-500" /> Customer Praise
            </h3>
            <span className="text-xs text-amber-600 font-bold">100% 5-Star Reviews</span>
          </div>

          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{r.userName}</span>
                  <div className="flex text-amber-500 text-[10px]">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 italic text-[11px]">"{r.comment}"</p>
                <p className="text-slate-500 text-[10px]">{r.date} • {r.serviceName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPerformance;
