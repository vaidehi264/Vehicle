import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import {
  FaCar,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaArrowRight,
  FaTools,
  FaRoute,
} from "react-icons/fa";

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadData = () => {
    const allVehicles = storageService.getVehicles();
    const allBookings = storageService.getBookings();
    const userId = currentUser?.id || "usr-001";

    const myVehicles = allVehicles.filter((v) => v.userId === userId);
    setVehicles(myVehicles);

    const myBookings = allBookings.filter(
      (b) => b.userId === userId || b.customerEmail === currentUser?.email
    );
    setBookings(myBookings);
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Assigned" || b.status === "Accepted"
  );
  const activeServices = bookings.filter((b) => b.status === "In Progress");
  const completedServices = bookings.filter((b) => b.status === "Completed");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {currentUser?.name || "Rahul Sharma"}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Verified Member
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome to your vehicle service management center. Track active workshop repairs and schedule maintenance in a click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/user/vehicles"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <FaCar className="w-3.5 h-3.5 text-orange-400" />
            <span>My Garage ({vehicles.length})</span>
          </Link>
          <Link
            to="/user/book-service"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Book New Service</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Cars"
          value={vehicles.length}
          icon={FaCar}
          subtitle="Vehicles in your profile"
          color="sky"
        />
        <StatCard
          title="Upcoming Appointments"
          value={upcomingBookings.length}
          icon={FaClock}
          subtitle="Confirmed bookings"
          color="orange"
        />
        <StatCard
          title="Active in Workshop"
          value={activeServices.length}
          icon={FaTools}
          subtitle="Live repairs in bay"
          color="purple"
        />
        <StatCard
          title="Completed Services"
          value={completedServices.length}
          icon={FaCheckCircle}
          subtitle="Guaranteed 1000 km warranty"
          color="emerald"
        />
      </div>

      {/* Active Service Tracker Alert if a car is in progress */}
      {activeServices.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Live Bay Repair Active
            </span>
            <h3 className="text-lg font-bold text-white">
              {activeServices[0].serviceName}
            </h3>
            <p className="text-xs text-slate-300">
              Vehicle: <strong className="text-white">{activeServices[0].vehicleDetails?.make} {activeServices[0].vehicleDetails?.model}</strong> ({activeServices[0].vehicleDetails?.registrationNumber}) • Master Tech: <strong className="text-sky-400">{activeServices[0].mechanicName}</strong>
            </p>
          </div>

          <Link
            to={`/user/tracking/${activeServices[0].id}`}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <FaRoute className="w-3.5 h-3.5" />
            <span>Open Live Tracking Stepper</span>
          </Link>
        </div>
      )}

      {/* Main Grid: My Vehicles & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Registered Vehicles */}
        <div className="lg:col-span-6 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">My Registered Vehicles</h3>
              <p className="text-xs text-slate-400">Cars connected to your AutoServe account</p>
            </div>
            <Link
              to="/user/vehicles"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Manage Vehicles →
            </Link>
          </div>

          <div className="space-y-3">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={veh.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100"}
                    alt={veh.model}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {veh.make} {veh.model} ({veh.year})
                    </h4>
                    <p className="text-xs font-mono font-bold text-orange-400">
                      {veh.registrationNumber}
                    </p>
                    <p className="text-[10px] text-slate-400">Fuel: {veh.fuelType} • Mileage: {veh.mileage}</p>
                  </div>
                </div>

                <Link
                  to={`/user/book-service?vehicleId=${veh.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shrink-0"
                >
                  Book Service
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming & Recent Bookings */}
        <div className="lg:col-span-6 bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Recent & Scheduled Bookings</h3>
              <p className="text-xs text-slate-400">Service appointments history</p>
            </div>
            <Link
              to="/user/bookings"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              View All ({bookings.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-400">{b.id}</span>
                    <Badge size="xs">{b.status}</Badge>
                  </div>
                  <p className="font-bold text-white">{b.serviceName}</p>
                  <p className="text-slate-400">
                    {b.vehicleDetails?.make} {b.vehicleDetails?.model} • Date: {b.bookingDate}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-white">₹{b.serviceCost.toLocaleString()}</p>
                  <Link
                    to={`/user/tracking/${b.id}`}
                    className="text-[11px] font-bold text-sky-400 hover:text-sky-300 block mt-1"
                  >
                    Track Progress →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

