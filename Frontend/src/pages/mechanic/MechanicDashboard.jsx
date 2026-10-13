import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import {
  FaTools,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaCar,
} from "react-icons/fa";

export const MechanicDashboard = () => {
  const { currentUser } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadData = () => {
    const allBookings = storageService.getBookings();
    // Filter bookings assigned to this mechanic (or default to mech-001 Suresh Verma if demo)
    const mechId = currentUser?.id || "mech-001";
    const filtered = allBookings.filter(
      (b) => b.mechanicId === mechId || b.mechanicName === currentUser?.name
    );
    setMyBookings(filtered);

    const allReviews = storageService.getReviews();
    setReviews(
      allReviews.filter(
        (r) => r.mechanicId === mechId || r.mechanicName === currentUser?.name
      )
    );
  };

  const assignedCount = myBookings.filter((b) => b.status === "Assigned").length;
  const inProgressCount = myBookings.filter((b) => b.status === "In Progress").length;
  const completedCount = myBookings.filter((b) => b.status === "Completed").length;

  const activeJobs = myBookings.filter(
    (b) => b.status === "In Progress" || b.status === "Accepted"
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100"}
            alt="Mechanic"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Welcome back, {currentUser?.name || "Suresh Verma"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold border border-sky-500/30">
                Lead Bay Specialist
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Specialization: <span className="text-orange-400 font-semibold">{currentUser?.specialization || "Engine Diagnostics & Overhaul"}</span> • Status: <span className="text-emerald-400 font-semibold">{currentUser?.availability || "Available"}</span>
            </p>
          </div>
        </div>

        <Link
          to="/mechanic/jobs"
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FaTools className="w-3.5 h-3.5" />
          <span>Open Active Bay Manager</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Requests"
          value={assignedCount}
          icon={FaClock}
          subtitle="Awaiting your acceptance"
          color="orange"
        />
        <StatCard
          title="In Progress Bay"
          value={inProgressCount}
          icon={FaTools}
          subtitle="Actively on repair hoist"
          color="sky"
        />
        <StatCard
          title="Completed Jobs"
          value={completedCount + 120} // combined with historical baseline
          icon={FaCheckCircle}
          change="+14 this week"
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Customer Rating"
          value={`${currentUser?.rating || "4.9"} ★`}
          icon={FaStar}
          subtitle={`${reviews.length + 38} reviews verified`}
          color="orange"
        />
      </div>

      {/* Main Grid: Active Jobs & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Jobs in Progress */}
        <div className="lg:col-span-8 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Active Bay Jobs</h3>
              <p className="text-xs text-slate-400">Cars currently on your workshop lift</p>
            </div>
            <Link
              to="/mechanic/jobs"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Update Stage & Notes →
            </Link>
          </div>

          {activeJobs.length > 0 ? (
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-400">{job.id}</span>
                      <Badge size="xs">{job.status}</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-white">{job.serviceName}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <FaCar className="text-slate-500" />
                      <span>{job.vehicleDetails?.make} {job.vehicleDetails?.model} ({job.vehicleDetails?.registrationNumber})</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Customer: {job.customerName} • ETA: {job.estimatedCompletionTime || "Today"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/mechanic/jobs"
                      className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all"
                    >
                      Manage Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No jobs currently in progress on hoist. Check "Service Requests" to accept new incoming bookings.
            </div>
          )}
        </div>

        {/* Recent Customer Feedback for this Mechanic */}
        <div className="lg:col-span-4 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Recent Feedback</h3>
            <span className="text-xs font-bold text-amber-400">★ 4.9 Average</span>
          </div>

          <div className="space-y-3">
            {reviews.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{r.userName}</span>
                  <div className="flex text-amber-400 text-[10px]">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">
                  "{r.comment}"
                </p>
                <span className="text-[10px] text-slate-500 block">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboard;
