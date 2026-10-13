import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { FaHistory, FaCar, FaCheckCircle, FaStar, FaRupeeSign } from "react-icons/fa";

export const UserServiceHistory = () => {
  const { currentUser } = useAuth();
  const [completedServices, setCompletedServices] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = () => {
    const all = storageService.getBookings();
    const userId = currentUser?.id || "usr-001";
    const completed = all.filter(
      (b) =>
        (b.userId === userId || b.customerEmail === currentUser?.email) &&
        b.status === "Completed"
    );
    setCompletedServices(completed);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Service History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Permanent vehicle maintenance passport with digital invoices, replacement parts logs, and warranty records.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          {completedServices.length} Completed Service Records
        </span>
      </div>

      {/* History Grid */}
      <div className="space-y-4">
        {completedServices.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-orange-600">{service.id}</span>
                <Badge size="xs" variant="success">Completed</Badge>
                <span className="text-xs text-slate-500">Date: {service.bookingDate}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{service.serviceName}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <FaCar className="text-orange-500" />
                  <strong className="text-slate-800">{service.vehicleDetails?.make} {service.vehicleDetails?.model}</strong> ({service.vehicleDetails?.registrationNumber})
                </span>
                <span>•</span>
                <span>Tech: <strong className="text-sky-600">{service.mechanicName || "Suresh Verma"}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Warranty Valid (1000 km)</span>
              </div>

              {service.serviceNotes && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  Notes: "{service.serviceNotes}"
                </p>
              )}
            </div>

            <div className="flex flex-col md:items-end justify-between gap-3 shrink-0">
              <div className="md:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Final Invoice Paid</span>
                <span className="text-2xl font-black text-slate-900">₹{service.serviceCost.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Paid via {service.paymentMethod || "UPI"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/user/reviews"
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-amber-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FaStar className="w-3 h-3" />
                  <span>Leave Review</span>
                </Link>
                <Link
                  to={`/user/book-service?serviceId=${service.serviceId}`}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all"
                >
                  Rebook Package
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedServices.length === 0 && (
        <EmptyState
          icon={FaHistory}
          title="No Completed Services Yet"
          description="Finished vehicle repairs and maintenance invoices will be recorded here."
        />
      )}
    </div>
  );
};

export default UserServiceHistory;
