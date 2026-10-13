import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaCar,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

export const MyServiceRequests = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadRequests = () => {
    const all = storageService.getBookings();
    const mechId = currentUser?.id || "mech-001";
    // Show requests that are Assigned (awaiting accept) or Pending without mechanic
    const assignedToMe = all.filter(
      (b) =>
        (b.mechanicId === mechId || b.mechanicName === currentUser?.name) &&
        (b.status === "Assigned" || b.status === "Pending")
    );
    setRequests(assignedToMe);
  };

  const handleAccept = (booking) => {
    const all = storageService.getBookings();
    const updated = all.map((b) =>
      b.id === booking.id
        ? {
            ...b,
            status: "Accepted",
            serviceNotes: b.serviceNotes
              ? `${b.serviceNotes}\nJob accepted by master mechanic.`
              : "Job accepted by master mechanic. Preparing bay & diagnostic scanner.",
          }
        : b
    );
    storageService.setBookings(updated);
    addToast(`Accepted service booking ${booking.id}! Ready for bay setup.`, "success");
    loadRequests();
  };

  const handleReject = (booking) => {
    if (window.confirm(`Decline job request ${booking.id}? It will be returned to admin pool.`)) {
      const all = storageService.getBookings();
      const updated = all.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              mechanicId: null,
              mechanicName: "Unassigned",
              mechanicPhone: null,
              status: "Pending",
              serviceNotes: b.serviceNotes
                ? `${b.serviceNotes}\nDeclined by technician; bay reassignment required.`
                : "Declined by technician; bay reassignment required.",
            }
          : b
      );
      storageService.setBookings(updated);
      addToast(`Declined booking ${booking.id}. Returned to unassigned pool.`, "warning");
      loadRequests();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Incoming Service Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review allocated bookings, customer symptoms, and confirm or decline bay assignment.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
          {requests.length} Requests Awaiting Response
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((booking) => (
          <div
            key={booking.id}
            className="bg-[#182234] border border-slate-750/70 hover:border-slate-650 rounded-3xl p-6 shadow-xl transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-extrabold text-orange-400">
                  {booking.id}
                </span>
                <Badge size="xs">{booking.status}</Badge>
                <span className="text-xs text-slate-400">
                  Submitted: {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-sm font-black text-white">
                  ₹{booking.serviceCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase">
                  Payout Estimate
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Customer info */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block mb-1">Vehicle Owner</span>
                <p className="text-white font-bold text-sm">{booking.customerName}</p>
                <p className="text-slate-400">{booking.customerPhone}</p>
                <p className="text-slate-400">{booking.customerEmail}</p>
              </div>

              {/* Vehicle info */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block mb-1">Vehicle Details</span>
                <p className="text-white font-bold text-sm">
                  {booking.vehicleDetails?.make} {booking.vehicleDetails?.model}
                </p>
                <p className="text-orange-400 font-mono font-bold">
                  {booking.vehicleDetails?.registrationNumber}
                </p>
                <p className="text-slate-400">Fuel: {booking.vehicleDetails?.fuelType}</p>
              </div>

              {/* Slot info */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block mb-1">Appointment Slot</span>
                <p className="text-white font-medium">{booking.bookingDate}</p>
                <p className="text-orange-400 font-semibold">{booking.timeSlot}</p>
                <p className="text-slate-400">{booking.pickupType}</p>
              </div>
            </div>

            {/* Problem description */}
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs">
              <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <FaExclamationTriangle className="text-amber-400" />
                Customer Problem Description:
              </p>
              <p className="text-slate-300 leading-relaxed">
                {booking.problemDescription || "Routine periodic checkup scheduled."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => handleReject(booking)}
                className="px-4 py-2 bg-slate-850 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaTimes className="w-3 h-3" />
                <span>Decline Request</span>
              </button>

              <button
                onClick={() => handleAccept(booking)}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaCheck className="w-3 h-3" />
                <span>Accept & Prep Hoist</span>
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <EmptyState
            icon={FaClipboardList}
            title="No Pending Service Requests"
            description="You have responded to all assigned customer requests. Check 'Active Job Manager' to work on accepted jobs."
          />
        )}
      </div>
    </div>
  );
};

export default MyServiceRequests;

