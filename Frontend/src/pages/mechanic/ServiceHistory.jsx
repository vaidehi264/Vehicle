import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { FaHistory, FaCar, FaCheckCircle, FaSearch, FaRupeeSign } from "react-icons/fa";

export const ServiceHistory = () => {
  const { currentUser } = useAuth();
  const [completedJobs, setCompletedJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = () => {
    const all = storageService.getBookings();
    const mechId = currentUser?.id || "mech-001";
    const history = all.filter(
      (b) =>
        (b.mechanicId === mechId || b.mechanicName === currentUser?.name) &&
        b.status === "Completed"
    );
    setCompletedJobs(history);
  };

  const filtered = completedJobs.filter(
    (j) =>
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase()) ||
      j.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (j.vehicleDetails?.registrationNumber &&
        j.vehicleDetails.registrationNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Completed Job History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archived log of past finished vehicle repairs, diagnostic records, and quality check certifications.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          {completedJobs.length} Finished Repair Records
        </span>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm shadow-slate-200/50">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past jobs by ID, car, customer..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Vehicle & Customer</th>
                <th className="py-3.5 px-4">Service Package</th>
                <th className="py-3.5 px-4">Completion Date</th>
                <th className="py-3.5 px-4">QC Status</th>
                <th className="py-3.5 px-4 text-right">Service Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                    {job.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">
                      {job.vehicleDetails?.make} {job.vehicleDetails?.model}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {job.vehicleDetails?.registrationNumber}
                    </p>
                    <p className="text-[10px] text-slate-400">Customer: {job.customerName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{job.serviceName}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">
                      {job.serviceNotes || "Work completed per specifications."}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {job.bookingDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs" variant="success">Passed 100%</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    ₹{job.serviceCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={FaHistory}
            title="No Service History Yet"
            description="Completed jobs will automatically appear in this permanent record."
          />
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;
