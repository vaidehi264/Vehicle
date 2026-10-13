import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { storageService } from "../../utils/storage";
import Badge from "../../components/common/Badge";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaCar,
} from "react-icons/fa";

export const AvailabilityManagement = () => {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [availability, setAvailability] = useState(currentUser?.availability || "Available");
  const [workingHours, setWorkingHours] = useState(currentUser?.workingHours || "09:00 AM - 07:00 PM");
  const [workingDays, setWorkingDays] = useState(currentUser?.workingDays || "Mon - Sat");

  const bookings = storageService.getBookings();
  const mechId = currentUser?.id || "mech-001";
  const upcomingAssignments = bookings.filter(
    (b) =>
      (b.mechanicId === mechId || b.mechanicName === currentUser?.name) &&
      (b.status === "Assigned" || b.status === "Accepted" || b.status === "In Progress")
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      availability,
      workingHours,
      workingDays,
    });
    addToast("Availability & working hours successfully saved", "success");
  };

  const handleToggle = () => {
    const next = availability === "Available" ? "Busy" : "Available";
    setAvailability(next);
    updateProfile({ availability: next });
    addToast(`Duty status switched to ${next}`, next === "Available" ? "success" : "info");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Availability & Bay Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your service hoist availability, working shift hours, and view assigned booking roster.
          </p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
            availability === "Available"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-amber-50 border-amber-300 text-amber-800"
          }`}
        >
          {availability === "Available" ? <FaToggleOn className="w-5 h-5 text-emerald-600" /> : <FaToggleOff className="w-5 h-5 text-amber-600" />}
          <span>Status: {availability}</span>
        </button>
      </div>

      {/* Working Schedule Form */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm shadow-slate-200/50 space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
          <FaClock className="text-orange-600" /> Configure Shift Preferences
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duty Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Available">Available (Accepting New Work)</option>
                <option value="Busy">Busy (All Bay Hoists Occupied)</option>
                <option value="On Leave">On Leave / Vacation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Daily Shift Hours
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 09:00 AM - 07:00 PM"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Working Days per Week
            </label>
            <input
              type="text"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              placeholder="e.g. Mon - Sat, or Tue - Sun"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FaSave className="w-3.5 h-3.5" />
              <span>Save Schedule</span>
            </button>
          </div>
        </form>
      </div>

      {/* Upcoming Assigned Roster */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm shadow-slate-200/50 space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-orange-600" /> Upcoming Bay Assignments
        </h3>

        {upcomingAssignments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAssignments.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-orange-600">{b.id}</span>
                    <Badge size="xs">{b.status}</Badge>
                  </div>
                  <p className="font-bold text-slate-900">{b.serviceName}</p>
                  <p className="text-slate-500">
                    {b.vehicleDetails?.make} {b.vehicleDetails?.model} ({b.vehicleDetails?.registrationNumber})
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-800">{b.bookingDate}</p>
                  <p className="text-orange-600 font-semibold">{b.timeSlot}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-xs py-4 text-center">
            No upcoming assignments scheduled for this week.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityManagement;
