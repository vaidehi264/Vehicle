import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaCalendarCheck,
  FaCar,
  FaClock,
  FaEye,
  FaTimesCircle,
  FaRoute,
  FaUserCheck,
  FaSearch,
} from "react-icons/fa";

export const MyBookings = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadBookings = () => {
    const all = storageService.getBookings();
    const userId = currentUser?.id || "usr-001";
    setBookings(all.filter((b) => b.userId === userId || b.customerEmail === currentUser?.email));
  };

  const handleCancelBooking = (booking) => {
    if (window.confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      const all = storageService.getBookings();
      const updated = all.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: "Cancelled",
              serviceNotes: "Cancelled by customer before service start.",
              paymentStatus: "Refunded",
            }
          : b
      );
      storageService.setBookings(updated);
      addToast(`Booking ${booking.id} has been cancelled`, "info");
      loadBookings();
    }
  };

  const statuses = ["all", "Pending", "Assigned", "Accepted", "In Progress", "Completed", "Cancelled"];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicleDetails?.make && b.vehicleDetails.make.toLowerCase().includes(search.toLowerCase())) ||
      (b.vehicleDetails?.registrationNumber && b.vehicleDetails.registrationNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track current appointments, monitor assigned mechanics, review completed services, or cancel bookings.
          </p>
        </div>

        <Link
          to="/user/book-service"
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Book New Service</span>
        </Link>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-lg">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings by ID, vehicle..."
            className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filter:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const isCancellable = b.status === "Pending" || b.status === "Assigned";
          return (
            <div
              key={b.id}
              className="bg-[#182234] border border-slate-750/70 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-orange-400">{b.id}</span>
                  <Badge size="xs">{b.status}</Badge>
                  <span className="text-[11px] text-slate-400">
                    Date: <strong className="text-white">{b.bookingDate}</strong> • {b.timeSlot}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{b.serviceName}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <FaCar className="text-orange-400" />
                    <strong>{b.vehicleDetails?.make} {b.vehicleDetails?.model}</strong> ({b.vehicleDetails?.registrationNumber})
                  </span>
                  <span>•</span>
                  <span>Handover: {b.pickupType}</span>
                  {b.mechanicName && b.mechanicName !== "Unassigned" && (
                    <>
                      <span>•</span>
                      <span className="text-sky-400 font-semibold flex items-center gap-1">
                        <FaUserCheck className="w-3 h-3" /> Tech: {b.mechanicName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Service Cost</span>
                  <span className="text-xl font-black text-white">₹{b.serviceCost.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold block">{b.paymentStatus}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  <Link
                    to={`/user/tracking/${b.id}`}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                  >
                    <FaRoute className="w-3 h-3" />
                    <span>Track Live</span>
                  </Link>

                  {isCancellable && (
                    <button
                      onClick={() => handleCancelBooking(b)}
                      title="Cancel Booking"
                      className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <FaTimesCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <EmptyState
          icon={FaCalendarCheck}
          title="No Bookings Found"
          description="You have no bookings matching the selected filter."
        />
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Details: ${selectedBooking.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-slate-400 block">Status:</span>
                <div className="mt-1">
                  <Badge size="sm">{selectedBooking.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Amount:</span>
                <span className="font-extrabold text-lg text-orange-400">
                  ₹{selectedBooking.serviceCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Vehicle</span>
              <p className="text-slate-300">
                {selectedBooking.vehicleDetails?.make} {selectedBooking.vehicleDetails?.model} ({selectedBooking.vehicleDetails?.year})
              </p>
              <p className="font-mono text-orange-400 font-bold">{selectedBooking.vehicleDetails?.registrationNumber}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Service Package</span>
              <p className="text-slate-300">{selectedBooking.serviceName}</p>
              <p className="text-slate-400">{selectedBooking.bookingDate} • {selectedBooking.timeSlot}</p>
            </div>

            {selectedBooking.serviceNotes && (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-300 block">Workshop Updates:</span>
                <p className="text-slate-300 leading-relaxed italic">{selectedBooking.serviceNotes}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBookings;

