import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import {
  FaCar,
  FaWrench,
  FaCalendarAlt,
  FaArrowRight,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";

export const BookService = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [pickupType, setPickupType] = useState("Doorstep Pickup & Drop");
  const [problemDescription, setProblemDescription] = useState("");

  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Confirmation
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  useEffect(() => {
    const allVehicles = storageService.getVehicles();
    const userId = currentUser?.id || "usr-001";
    const myVehicles = allVehicles.filter((v) => v.userId === userId);
    setVehicles(myVehicles);

    const allServices = storageService.getServices();
    setServices(allServices);

    // Auto-select from URL search params if provided
    const paramServiceId = searchParams.get("serviceId");
    if (paramServiceId && allServices.some((s) => s.id === paramServiceId)) {
      setSelectedServiceId(paramServiceId);
    } else if (allServices.length > 0) {
      setSelectedServiceId(allServices[0].id);
    }

    const paramVehicleId = searchParams.get("vehicleId");
    if (paramVehicleId && myVehicles.some((v) => v.id === paramVehicleId)) {
      setSelectedVehicleId(paramVehicleId);
    } else if (myVehicles.length > 0) {
      setSelectedVehicleId(myVehicles[0].id);
    }

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, [currentUser, searchParams]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleReview = (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      addToast("Please select or add a vehicle first", "error");
      return;
    }
    if (!selectedService) {
      addToast("Please select a service package", "error");
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = () => {
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newId,
      userId: currentUser?.id || "usr-001",
      customerName: currentUser?.name || "Rahul Sharma",
      customerEmail: currentUser?.email || "user@autoserve.com",
      customerPhone: currentUser?.phone || "+91 98765 43210",
      vehicleId: selectedVehicle.id,
      vehicleDetails: {
        make: selectedVehicle.make,
        model: selectedVehicle.model,
        year: selectedVehicle.year,
        registrationNumber: selectedVehicle.registrationNumber,
        fuelType: selectedVehicle.fuelType,
      },
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      serviceCost: selectedService.price,
      bookingDate,
      timeSlot,
      pickupType,
      status: "Pending",
      mechanicId: null,
      mechanicName: "Unassigned",
      mechanicPhone: null,
      problemDescription: problemDescription || "Routine scheduled maintenance.",
      diagnosticFindings: "",
      serviceNotes: "Booking received. Workshop coordinator will assign certified bay technician.",
      estimatedCompletionTime: "Pending Inspection",
      createdAt: new Date().toISOString(),
      paymentStatus: "Pending",
      paymentMethod: "Pay on Completion",
    };

    const all = storageService.getBookings();
    storageService.setBookings([newBooking, ...all]);

    setConfirmedBookingId(newId);
    setStep(3);
    addToast(`Booking ${newId} confirmed successfully!`, "success");
  };

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Schedule Vehicle Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your vehicle, select a certified service package, pick a time slot, and confirm upfront transparent pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
            Step {step} of 3
          </span>
        </div>
      </div>

      {/* Step 1: Booking Form */}
      {step === 1 && (
        <form onSubmit={handleReview} className="space-y-6">
          {/* 1. Vehicle Selection */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FaCar className="text-orange-600" /> 1. Select Registered Vehicle
              </h3>
              <Link
                to="/user/vehicles"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <FaPlus className="w-2.5 h-2.5" /> Add Another Car
              </Link>
            </div>

            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map((veh) => {
                  const isSelected = selectedVehicleId === veh.id;
                  return (
                    <div
                      key={veh.id}
                      onClick={() => setSelectedVehicleId(veh.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-orange-50 border-orange-500 shadow-sm shadow-orange-500/10"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <img
                        src={veh.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100"}
                        alt={veh.model}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {veh.make} {veh.model}
                        </p>
                        <p className="font-mono text-[11px] font-bold text-orange-600">
                          {veh.registrationNumber}
                        </p>
                        <p className="text-[10px] text-slate-500">{veh.fuelType} • {veh.year}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-500">No vehicles found in your garage.</p>
                <Link
                  to="/user/vehicles"
                  className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Register a Vehicle First
                </Link>
              </div>
            )}
          </div>

          {/* 2. Service Package Selection */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <FaWrench className="text-orange-600" /> 2. Choose Service Package
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-orange-50 border-orange-500 shadow-sm shadow-orange-500/10"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-orange-600">
                          {srv.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          ₹{srv.price.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">{srv.name}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
                      <span>Est: {srv.estimatedDuration}</span>
                      <span className="text-emerald-600 font-semibold">1000 km Warranty</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Date, Time & Logistics */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-600" /> 3. Schedule & Pickup Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Logistics & Handover Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "Doorstep Pickup & Drop", desc: "Our driver picks up your car & returns it after service (Complimentary)" },
                  { id: "Self Drop-off", desc: "You drive to our authorized workshop service center" },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setPickupType(opt.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      pickupType === opt.id
                        ? "bg-orange-50 border-orange-500 text-orange-950 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-xs">{opt.id}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Vehicle Symptoms or Problems (Optional)
              </label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. Squeaking noise while turning, AC cooling low in afternoon, brake pedal feels spongy..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 custom-scroll transition-all"
              />
            </div>
          </div>

          {/* Review Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Review Booking Details</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Review Booking Screen */}
      {step === 2 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm shadow-slate-200/50 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Review Service Booking Details</h3>
            <p className="text-xs text-slate-500">Please verify your booking parameters before confirming.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold block">Vehicle</span>
              <p className="text-slate-900 font-bold text-sm">
                {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.year})
              </p>
              <p className="font-mono text-orange-600 font-bold">
                {selectedVehicle?.registrationNumber}
              </p>
              <p className="text-slate-500">{selectedVehicle?.fuelType}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold block">Selected Package</span>
              <p className="text-slate-900 font-bold text-sm">{selectedService?.name}</p>
              <p className="text-slate-500">Duration: {selectedService?.estimatedDuration}</p>
              <p className="text-2xl font-black text-orange-600">
                ₹{selectedService?.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Date & Slot:</span>
              <span className="text-slate-900 font-semibold">{bookingDate} • {timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Handover Mode:</span>
              <span className="text-emerald-600 font-semibold">{pickupType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Name:</span>
              <span className="text-slate-900 font-semibold">{currentUser?.name || "Rahul Sharma"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Option:</span>
              <span className="text-slate-700 font-semibold">Pay on Delivery / Completion</span>
            </div>
          </div>

          {problemDescription && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block mb-1">Reported Notes:</span>
              <p className="text-slate-700 italic">{problemDescription}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleConfirmBooking}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              Confirm & Book Service Now
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Booking Confirmation Screen */}
      {step === 3 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <FaCheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Booking Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Service Appointment Scheduled!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your vehicle service booking has been registered with ID{" "}
              <strong className="text-orange-600 font-mono text-sm">{confirmedBookingId}</strong>. A master technician is being allocated.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Vehicle:</span>
              <span className="font-bold text-slate-900">{selectedVehicle?.make} {selectedVehicle?.model}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Date & Time:</span>
              <span className="font-semibold text-slate-900">{bookingDate} • {timeSlot}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Estimated Fee:</span>
              <span className="font-extrabold text-orange-600 text-sm">₹{selectedService?.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/user/tracking/${confirmedBookingId}`)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Track Live Progress</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/user/bookings"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors shadow-sm"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;
