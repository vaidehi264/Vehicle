import React, { useState } from "react";
import { storageService } from "../../utils/storage";
import StatCard from "../../components/common/StatCard";
import {
  FaChartBar,
  FaRupeeSign,
  FaCheckCircle,
  FaStar,
  FaCalendarAlt,
  FaWrench,
  FaUserCheck,
  FaAward,
} from "react-icons/fa";

export const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState("30days");

  const bookings = storageService.getBookings();
  const mechanics = storageService.getMechanics();
  const services = storageService.getServices();

  const totalBookings = bookings.length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const completionRate = totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;
  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.serviceCost || 0), 0);

  // Mechanic Leaderboard sorted by rating & completed jobs
  const sortedMechanics = [...mechanics].sort(
    (a, b) => (b.completedJobs || 0) - (a.completedJobs || 0)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Reports & Workshop Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Financial revenue breakdowns, bay throughput, mechanic productivity, and customer retention metrics.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <FaCalendarAlt className="w-3.5 h-3.5 text-orange-400 ml-2" />
          {[
            { id: "7days", label: "Last 7 Days" },
            { id: "30days", label: "Last 30 Days" },
            { id: "year", label: "This Year" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dateRange === range.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Generated Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={FaRupeeSign}
          change="+18.4%"
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Job Completion Rate"
          value={`${completionRate}%`}
          icon={FaCheckCircle}
          change="+4.2%"
          trend="up"
          color="sky"
        />
        <StatCard
          title="Average Customer Rating"
          value="4.86 ★"
          icon={FaStar}
          subtitle="Based on 450+ verified reviews"
          color="orange"
        />
        <StatCard
          title="Fleet Throughput"
          value={`${totalBookings} Cars`}
          icon={FaWrench}
          subtitle="Avg bay time: 2.8 hrs"
          color="purple"
        />
      </div>

      {/* Charts / Performance Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Monthly Revenue & Job Trend CSS Visualization */}
        <div className="lg:col-span-7 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Revenue Progression</h3>
              <p className="text-xs text-slate-400">Total gross receipts across all garage bays</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Target: +15% Met
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            {[
              { month: "January", revenue: 84500, percent: 55 },
              { month: "February", revenue: 102300, percent: 68 },
              { month: "March", revenue: 128900, percent: 82 },
              { month: "April", revenue: 146000, percent: 92 },
              { month: "May (Current)", revenue: 164200, percent: 100 },
            ].map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.month}</span>
                  <span className="font-mono font-bold text-orange-400">
                    ₹{item.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Projected Q2 Turnover:</span>
            <span className="font-extrabold text-white text-sm">₹4,95,000</span>
          </div>
        </div>

        {/* Right: Master Mechanic Performance Leaderboard */}
        <div className="lg:col-span-5 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FaAward className="text-amber-400" /> Technician Leaderboard
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Top Ranked</span>
          </div>

          <div className="space-y-3">
            {sortedMechanics.map((mech, index) => (
              <div
                key={mech.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : index === 1
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {index + 1}
                  </span>
                  <img
                    src={mech.avatar}
                    alt={mech.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white text-xs">{mech.name}</p>
                    <p className="text-[10px] text-slate-400">{mech.specialization}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs justify-end">
                    <FaStar className="w-3 h-3" /> {mech.rating}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    {mech.completedJobs || 120} jobs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

