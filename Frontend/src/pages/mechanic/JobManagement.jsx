import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaTools,
  FaCheckCircle,
  FaEdit,
  FaCar,
  FaClock,
  FaFileAlt,
  FaMicrochip,
  FaArrowRight,
} from "react-icons/fa";

export const JobManagement = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);

  // Active edit modal
  const [activeJob, setActiveJob] = useState(null);
  const [stage, setStage] = useState("");
  const [diagnosticFindings, setDiagnosticFindings] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");

  useEffect(() => {
    loadJobs();
    const handleUpdate = () => loadJobs();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadJobs = () => {
    const all = storageService.getBookings();
    const mechId = currentUser?.id || "mech-001";
    const myJobs = all.filter(
      (b) =>
        (b.mechanicId === mechId || b.mechanicName === currentUser?.name) &&
        b.status !== "Cancelled"
    );
    setJobs(myJobs);
  };

  const handleOpenUpdate = (job) => {
    setActiveJob(job);
    setStage(job.status);
    setDiagnosticFindings(job.diagnosticFindings || "");
    setServiceNotes(job.serviceNotes || "");
    setEstimatedCompletion(job.estimatedCompletionTime || "Today at 05:00 PM");
  };

  const handleSaveJobUpdate = (e) => {
    e.preventDefault();
    if (!activeJob) return;

    const all = storageService.getBookings();
    const updated = all.map((b) =>
      b.id === activeJob.id
        ? {
            ...b,
            status: stage,
            diagnosticFindings,
            serviceNotes,
            estimatedCompletionTime: estimatedCompletion,
            ...(stage === "Completed" && {
              paymentStatus: "Paid",
            }),
          }
        : b
    );

    storageService.setBookings(updated);
    addToast(`Job ${activeJob.id} updated to status "${stage}"`, "success");
    setActiveJob(null);
    loadJobs();
  };

  const stageOrder = ["Assigned", "Accepted", "In Progress", "Completed"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Active Job Management & Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Progress active repair jobs through workshop stages, record diagnostic findings, and set estimated delivery time.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
          {jobs.filter((j) => j.status !== "Completed").length} Unfinished Bay Jobs
        </span>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const currentStageIndex = stageOrder.indexOf(job.status);
          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600">{job.id}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{job.serviceName}</h3>
                  </div>
                  <Badge size="sm">{job.status}</Badge>
                </div>

                {/* Progress Stepper Visual */}
                <div className="py-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Service Progression:
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {stageOrder.map((s, idx) => {
                      const isPastOrCurrent = currentStageIndex >= idx;
                      const isCurrent = job.status === s;
                      return (
                        <div key={s} className="space-y-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCurrent
                                ? "bg-orange-500 ring-2 ring-orange-400/50"
                                : isPastOrCurrent
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                          />
                          <p
                            className={`text-[9px] truncate text-center font-semibold ${
                              isCurrent
                                ? "text-orange-600"
                                : isPastOrCurrent
                                ? "text-slate-700"
                                : "text-slate-400"
                            }`}
                          >
                            {s}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle & Customer info */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold text-slate-900">
                      {job.vehicleDetails?.make} {job.vehicleDetails?.model}
                    </span>
                    <span className="font-mono font-bold text-orange-600">
                      {job.vehicleDetails?.registrationNumber}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Customer: {job.customerName} ({job.customerPhone})
                  </p>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <FaClock className="text-orange-600" />
                    <span>Estimated Completion: <strong className="text-slate-900">{job.estimatedCompletionTime || "TBD"}</strong></span>
                  </p>
                </div>

                {/* Diagnostic notes preview */}
                {job.diagnosticFindings && (
                  <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200 text-xs mb-2">
                    <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-0.5">
                      Diagnostic Findings:
                    </p>
                    <p className="text-slate-700 leading-relaxed text-[11px] line-clamp-2">
                      {job.diagnosticFindings}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleOpenUpdate(job)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FaEdit className="w-3 h-3" />
                  <span>Update Stage, Notes & ETA</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <EmptyState
          icon={FaTools}
          title="No Active Jobs"
          description="You currently have no jobs assigned. Review incoming requests to begin."
        />
      )}

      {/* Update Job Modal */}
      {activeJob && (
        <Modal
          isOpen={!!activeJob}
          onClose={() => setActiveJob(null)}
          title={`Update Job Progression — ${activeJob.id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveJobUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Repair Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Assigned">Assigned (Awaiting Bay)</option>
                <option value="Accepted">Accepted (Prepped for Hoist)</option>
                <option value="In Progress">In Progress (Mechanical Work Active)</option>
                <option value="Completed">Completed (Final Testing Passed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estimated Service Completion Time
              </label>
              <input
                type="text"
                value={estimatedCompletion}
                onChange={(e) => setEstimatedCompletion(e.target.value)}
                placeholder="e.g. Today at 04:30 PM, or Tomorrow 11:00 AM"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Diagnostic Findings (OBD-II Codes, Rotor Wear, Battery Volts)
              </label>
              <textarea
                rows={3}
                value={diagnosticFindings}
                onChange={(e) => setDiagnosticFindings(e.target.value)}
                placeholder="e.g. Scanned OBD-II, zero engine DTCs. Rotor runout within 0.02mm OEM spec. Synthetic oil and OEM filter installed..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 custom-scroll font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Technician Service Notes for Customer
              </label>
              <textarea
                rows={3}
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Notes visible to customer in their live tracking view..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 custom-scroll transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Save & Update Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default JobManagement;
