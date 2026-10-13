import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaRoute,
  FaCar,
  FaWrench,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaPhoneAlt,
  FaShieldAlt,
  FaMicrochip,
  FaCalendarCheck,
} from "react-icons/fa";

export const ServiceTracking = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser, id]);

  const loadBookings = () => {
    const all = storageService.getBookings();
    const userId = currentUser?.id || "usr-001";
    const myBookings = all.filter(
      (b) => b.userId === userId || b.customerEmail === currentUser?.email
    );
    setBookings(myBookings);

    if (id && myBookings.some((b) => b.id === id)) {
      setSelectedBookingId(id);
    } else if (myBookings.length > 0) {
      // Pick first active or in-progress booking
      const active = myBookings.find((b) => b.status === "In Progress" || b.status === "Accepted" || b.status === "Assigned");
      setSelectedBookingId(active ? active.id : myBookings[0].id);
    }
  };

  const currentBooking = bookings.find((b) => b.id === selectedBookingId);

  // Stepper stages mapping
  const steps = [
    { title: "Booking Confirmed", desc: "Appointment logged in garage system" },
    { title: "Mechanic Assigned", desc: "OEM-certified technician allocated" },
    { title: "Diagnostics & Bay Setup", desc: "Vehicle on hoist with OBD-II scan" },
    { title: "Repair Work Active", desc: "Replacement of parts and fluid service" },
    { title: "Final QC & Ready", desc: "Multi-point testing & complimentary wash" },
  ];

  const getActiveStepIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Assigned":
        return 1;
      case "Accepted":
        return 2;
      case "In Progress":
        return 3;
      case "Completed":
        return 4;
      default:
        return 0;
    }
  };

  const activeStep = currentBooking ? getActiveStepIndex(currentBooking.status) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Service Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital hoist status, technician diagnostic findings, and estimated delivery timeline.
          </p>
        </div>

        {/* Booking Dropdown Selector */}
        {bookings.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Select Booking:</span>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:border-orange-500 font-mono focus:bg-white"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.vehicleDetails?.make} {b.vehicleDetails?.model} ({b.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {currentBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Visual Stepper */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm shadow-slate-200/50 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600">
                  Tracking Active Job
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{currentBooking.serviceName}</h3>
                <p className="text-xs text-slate-500">
                  Ref: <span className="font-mono text-orange-600 font-bold">{currentBooking.id}</span> • Scheduled: {currentBooking.bookingDate}
                </p>
              </div>

              <div className="sm:text-right">
                <Badge size="md">{currentBooking.status}</Badge>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 justify-end">
                  <FaClock className="text-orange-500 w-3 h-3" />
                  <span>ETA: <strong className="text-slate-900">{currentBooking.estimatedCompletionTime || "Today"}</strong></span>
                </p>
              </div>
            </div>

            {/* Stepper Display */}
            <div className="space-y-6">
              {steps.map((st, idx) => {
                const isPassed = activeStep > idx;
                const isCurrent = activeStep === idx;
                return (
                  <div key={idx} className="flex items-start gap-4 relative group">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-10 transition-colors ${
                          isPassed ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold transition-all shadow-md ${
                        isCurrent
                          ? "bg-orange-500 text-white shadow-orange-500/30 ring-4 ring-orange-500/20"
                          : isPassed
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-slate-100 border border-slate-200 text-slate-400"
                      }`}
                    >
                      {isPassed ? <FaCheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="pt-1 space-y-0.5">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? "text-orange-600"
                            : isPassed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-xs text-slate-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Findings Note Box */}
            {currentBooking.diagnosticFindings && (
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5 text-xs">
                <span className="font-bold text-sky-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <FaMicrochip /> Live Diagnostic Findings & Scans:
                </span>
                <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                  {currentBooking.diagnosticFindings}
                </p>
              </div>
            )}

            {/* General Service Notes */}
            {currentBooking.serviceNotes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Workshop Coordinator Notes:</span>
                <p className="text-slate-600 italic leading-relaxed">{currentBooking.serviceNotes}</p>
              </div>
            )}
          </div>

          {/* Right Column: Assigned Mechanic & Vehicle Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mechanic Profile */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                <FaUserCheck className="text-sky-600" /> Assigned Master Technician
              </h3>

              {currentBooking.mechanicName && currentBooking.mechanicName !== "Unassigned" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120"
                      alt="Mechanic"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{currentBooking.mechanicName}</h4>
                      <p className="text-xs text-orange-600 font-semibold">Master Tech Specialist</p>
                      <p className="text-[11px] text-amber-600 font-bold">★ 4.9 Verified Rating</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-500">Direct Contact Hotline:</p>
                    <p className="text-slate-900 font-bold flex items-center gap-2">
                      <FaPhoneAlt className="text-emerald-600 w-3 h-3" />
                      {currentBooking.mechanicPhone || "+91 98450 12345"}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    Assigned specifically for OEM tolerance checking and multi-point mechanical inspection.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-amber-600 font-semibold">
                    Technician Allocation in Progress
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Our garage coordinator is matching the top-rated specialist for your vehicle model.
                  </p>
                </div>
              )}
            </div>

            {/* Vehicle Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                <FaCar className="text-orange-500" /> Vehicle Information
              </h3>

              <div className="flex justify-between items-center text-slate-600">
                <span>Model:</span>
                <span className="font-bold text-slate-900">
                  {currentBooking.vehicleDetails?.make} {currentBooking.vehicleDetails?.model}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Registration:</span>
                <span className="font-mono font-bold text-orange-600">
                  {currentBooking.vehicleDetails?.registrationNumber}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Fuel Type:</span>
                <span className="text-slate-800">{currentBooking.vehicleDetails?.fuelType}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Upfront Fee:</span>
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{currentBooking.serviceCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FaRoute}
          title="No Active Service to Track"
          description="You don't have any bookings in progress right now. Schedule a service to track live."
          actionText="Book a Service"
          onAction={() => {}}
        />
      )}
    </div>
  );
};

export default ServiceTracking;
