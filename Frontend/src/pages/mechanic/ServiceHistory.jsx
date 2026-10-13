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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Completed Job History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Archived log of past finished vehicle repairs, diagnostic records, and quality check certifications.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {completedJobs.length} Finished Repair Records
        </span>
      </div>

      {/* Search */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-2xl p-4 shadow-lg">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past jobs by ID, car, customer..."
            className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Vehicle & Customer</th>
                <th className="py-3.5 px-4">Service Package</th>
                <th className="py-3.5 px-4">Completion Date</th>
                <th className="py-3.5 px-4">QC Status</th>
                <th className="py-3.5 px-4 text-right">Service Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                    {job.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">
                      {job.vehicleDetails?.make} {job.vehicleDetails?.model}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">
                      {job.vehicleDetails?.registrationNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">Customer: {job.customerName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">{job.serviceName}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">
                      {job.serviceNotes || "Work completed per specifications."}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {job.bookingDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs" variant="success">Passed 100%</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white">
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

