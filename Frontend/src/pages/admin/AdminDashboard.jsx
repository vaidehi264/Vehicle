import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storageService } from "../../utils/storage";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import {
  FaUsers,
  FaUserCog,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaRupeeSign,
  FaArrowRight,
  FaCar,
  FaWrench,
  FaShieldAlt,
} from "react-icons/fa";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, []);

  const loadData = () => {
    setUsers(storageService.getUsers());
    setMechanics(storageService.getMechanics());
    setBookings(storageService.getBookings());
    setServices(storageService.getServices());
  };

  // Metrics
  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalMechanics = mechanics.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending" || b.status === "Assigned").length;
  const completedServices = bookings.filter((b) => b.status === "Completed").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.serviceCost || 0), 0);

  const recentBookings = [...bookings].slice(0, 5);
  const recentUsers = [...users.filter((u) => u.role === "user")].slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
              Live Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time workshop bookings, mechanic allocation, customer registrations, and revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-1.5"
          >
            <span>Manage All Bookings</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Registered Users"
          value={totalUsers}
          icon={FaUsers}
          change="12%"
          trend="up"
          color="sky"
        />
        <StatCard
          title="Active Mechanics"
          value={totalMechanics}
          icon={FaUserCog}
          change="3 new"
          trend="up"
          color="purple"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={FaCalendarCheck}
          change="8.4%"
          trend="up"
          color="orange"
        />
        <StatCard
          title="Pending Action"
          value={pendingBookings}
          icon={FaClock}
          subtitle="Needs bay assign"
          color="orange"
        />
        <StatCard
          title="Completed Jobs"
          value={completedServices}
          icon={FaCheckCircle}
          change="99.2%"
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
          icon={FaRupeeSign}
          change="18.5%"
          trend="up"
          color="emerald"
        />
      </div>

      {/* Main Grid: Recent Bookings & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Service Bookings</h3>
              <p className="text-xs text-slate-500">Latest workshop arrivals and scheduled dispatches</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View Full Table →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Customer & Vehicle</th>
                  <th className="py-3 px-3">Service Package</th>
                  <th className="py-3 px-3">Assigned Mechanic</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-orange-600">{b.id}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.vehicleDetails?.make} {b.vehicleDetails?.model} ({b.vehicleDetails?.registrationNumber})
                      </p>
                    </td>
                    <td className="py-3.5 px-3 max-w-[160px] truncate font-medium text-slate-700">
                      {b.serviceName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-700 font-medium">
                        {b.mechanicName || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge size="xs">{b.status}</Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                      ₹{b.serviceCost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Customers & Quick Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Registrations */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Recent Users</h3>
              <Link to="/admin/users" className="text-xs font-bold text-orange-600 hover:text-orange-700">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Category Breakdown Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              Service Distribution
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>General Maintenance (42%)</span>
                  <span>₹18,400</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Brakes & Suspension (28%)</span>
                  <span>₹12,250</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Engine & Diagnostics (18%)</span>
                  <span>₹7,890</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Detailing & Body (12%)</span>
                  <span>₹5,260</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[12%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
