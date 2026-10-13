import React, { useState, useEffect } from "react";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { FaStar, FaSearch, FaFilter, FaCheckCircle, FaTrash, FaCommentAlt } from "react-icons/fa";

export const FeedbackReviews = () => {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setReviews(storageService.getReviews());
  };

  const handleDeleteReview = (review) => {
    if (window.confirm("Delete this review comment?")) {
      const all = storageService.getReviews();
      const updated = all.filter((r) => r.id !== review.id);
      storageService.setReviews(updated);
      loadReviews();
      addToast("Review removed from public feed", "info");
    }
  };

  const handleToggleStatus = (review) => {
    const newStatus = review.status === "Published" ? "Hidden" : "Published";
    const all = storageService.getReviews();
    const updated = all.map((r) =>
      r.id === review.id ? { ...r, status: newStatus } : r
    );
    storageService.setReviews(updated);
    loadReviews();
    addToast(`Review status updated to ${newStatus}`, "success");
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback & Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Read verified customer ratings, review remarks, technician praise, and moderate public feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
            <FaStar className="w-3.5 h-3.5 text-amber-500" /> Average Satisfaction: 4.9 / 5.0
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-sm shadow-slate-200/50">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, comment, service..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1">Rating:</span>
          {["all", "5", "4", "3"].map((rate) => (
            <button
              key={rate}
              onClick={() => setRatingFilter(rate)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                ratingFilter === rate
                  ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {rate === "all" ? "All Stars" : `${rate} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm shadow-slate-200/50 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rev.userName}</h4>
                    <p className="text-[11px] text-slate-500">{rev.date} • Ref: {rev.bookingId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-700 text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 font-bold">
                    <FaStar className="w-3 h-3 text-amber-500" /> {rev.rating}.0
                  </div>
                  <Badge size="xs">{rev.status || "Published"}</Badge>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-3 space-y-1 text-xs">
                <p className="text-orange-600 font-semibold">{rev.serviceName}</p>
                <p className="text-slate-500">Serviced by: <span className="text-slate-900 font-medium">{rev.mechanicName}</span></p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">{rev.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(rev)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  {rev.status === "Published" ? "Hide Review" : "Publish Review"}
                </button>
                <button
                  onClick={() => handleDeleteReview(rev)}
                  className="p-2 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <EmptyState
          icon={FaCommentAlt}
          title="No Reviews Found"
          description="No customer reviews match your search."
        />
      )}
    </div>
  );
};

export default FeedbackReviews;
