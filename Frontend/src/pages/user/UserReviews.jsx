import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import { FaStar, FaCommentAlt, FaCheckCircle, FaCar } from "react-icons/fa";

export const UserReviews = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);

  // Form
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadData = () => {
    const allReviews = storageService.getReviews();
    const allBookings = storageService.getBookings();
    const userId = currentUser?.id || "usr-001";

    const myReviews = allReviews.filter(
      (r) => r.userId === userId || r.userName === currentUser?.name
    );
    setReviews(myReviews);

    const myCompleted = allBookings.filter(
      (b) =>
        (b.userId === userId || b.customerEmail === currentUser?.email) &&
        b.status === "Completed"
    );
    setCompletedBookings(myCompleted);
    if (myCompleted.length > 0 && !selectedBookingId) {
      setSelectedBookingId(myCompleted[0].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast("Please provide review feedback comments", "error");
      return;
    }

    const booking = completedBookings.find((b) => b.id === selectedBookingId) || {
      id: "BK-8020",
      serviceName: "Ceramic Coating & Deep Paint Rejuvenation",
      mechanicId: "mech-001",
      mechanicName: "Suresh Verma",
    };

    setSubmitting(true);
    setTimeout(() => {
      const newReview = {
        id: `rev-${Date.now().toString().slice(-4)}`,
        bookingId: booking.id,
        userId: currentUser?.id || "usr-001",
        userName: currentUser?.name || "Rahul Sharma",
        userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        mechanicId: booking.mechanicId || "mech-001",
        mechanicName: booking.mechanicName || "Suresh Verma",
        serviceName: booking.serviceName,
        rating: Number(rating),
        date: new Date().toISOString().split("T")[0],
        comment,
        status: "Published",
      };

      const all = storageService.getReviews();
      storageService.setReviews([newReview, ...all]);

      setSubmitting(false);
      setComment("");
      addToast("Review and rating published successfully! Thank you for your feedback.", "success");
      loadData();
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reviews & Mechanic Ratings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rate completed garage services, evaluate technician craftsmanship, and help our community motorists.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
          <FaStar className="w-3 h-3 text-amber-500" /> Verified Customer Feedback
        </span>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm shadow-slate-200/50 space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
          <FaCommentAlt className="text-orange-600" /> Share Your Service Experience
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Completed Service Booking
            </label>
            {completedBookings.length > 0 ? (
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono focus:bg-white"
              >
                {completedBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.serviceName} ({b.vehicleDetails?.make} {b.vehicleDetails?.model})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                You currently have no completed services. (Using default completed booking sample)
              </p>
            )}
          </div>

          {/* Star Rating Interactive Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Technician Star Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <FaStar
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? "text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-600 ml-2">
                {rating} Stars ({rating === 5 ? "Exceptional" : rating === 4 ? "Great" : "Good"})
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Review Comments & Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the mechanic's craftsmanship? Was the pickup on time? How is the vehicle running now?..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 focus:bg-white custom-scroll"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaCheckCircle className="w-3.5 h-3.5" />
              <span>{submitting ? "Publishing..." : "Submit Review & Feedback"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Reviews History */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">My Submitted Reviews</h3>
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm shadow-slate-200/50 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{r.serviceName}</span>
                <p className="text-[11px] text-slate-500">
                  Technician: <strong className="text-orange-600">{r.mechanicName}</strong> • {r.date}
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold">
                <FaStar className="w-3 h-3 text-amber-500" />
                <span>{r.rating}.0</span>
              </div>
            </div>

            <p className="text-slate-700 italic pt-1 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              "{r.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;
