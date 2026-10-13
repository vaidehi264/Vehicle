import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export const ContactPage = () => {
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("Your inquiry has been submitted! Our team will contact you within 2 hours.", "success");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 600);
  };

  const faqs = [
    {
      q: "How does Doorstep Vehicle Pickup work?",
      a: "Our insured driver arrives at your specified address during your selected booking time slot, completes a digital vehicle condition check, and transports your car safely to our nearest authorized service workshop.",
    },
    {
      q: "Can I choose a specific mechanic for my car?",
      a: "Yes! During booking or through the admin/mechanic discovery dashboard, you can view mechanic profiles, ratings, and specializations to request your preferred technician.",
    },
    {
      q: "What if extra repairs are discovered during inspection?",
      a: "Our mechanics will upload high-definition photo/video evidence and diagnostic findings to your tracking portal. No additional repair is ever conducted without your explicit digital approval.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI, Net Banking, Credit/Debit cards, and Pay-on-Delivery after test drive and inspection.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          We Are Here For You
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contact VV Cars Support
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have questions regarding an upcoming booking or want to partner your workshop? Reach out to our dedicated support desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              Direct Contact Details
            </h3>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                <FaPhoneAlt className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Customer Care & Breakdown Hotline</p>
                <a href="tel:+917845963210" className="text-sm font-bold text-slate-900 mt-0.5 hover:text-orange-600 block">
                  +91 7845963210
                </a>
                <p className="text-xs text-slate-500">24/7 Breakdown Assistance</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Email Inquiries</p>
                <a href="mailto:vvcarservice@gmail.com" className="text-sm font-bold text-slate-900 mt-0.5 hover:text-orange-600 block">
                  vvcarservice@gmail.com
                </a>
                <p className="text-xs text-slate-500">Official Support & Service Inquiries</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Headquarters</p>
                <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">
                  Gift City, Gandhinagar, Gujrat - 382000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                <FaClock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Workshop Operating Hours</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Mon - Sat: 08:00 AM - 08:00 PM</p>
                <p className="text-xs text-slate-500">24/7 Roadside Assistance Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm shadow-slate-200/50">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h3>
            <p className="text-xs text-slate-500 mb-6">Our vehicle care advisors typically reply in under 2 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Aditi Rao"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="aditi@example.com"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 7845963210"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Inquiry Topic</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="General Inquiry">General Service Inquiry</option>
                    <option value="Booking Modification">Booking Status or Modification</option>
                    <option value="Mechanic Partnership">Join as Certified Mechanic</option>
                    <option value="Corporate Fleet">Corporate Fleet Management</option>
                    <option value="Billing & Refund">Billing / Invoice Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message / Vehicle Issue Details *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your query or specific symptoms your vehicle is experiencing..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 custom-scroll transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {loading ? "Submitting Inquiry..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto space-y-6 shadow-sm shadow-slate-200/50">
        <div className="text-center space-y-2 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <FaQuestionCircle className="text-orange-600" /> Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500">Everything you need to know about our service process.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <FaChevronUp className="w-3.5 h-3.5 text-orange-600 shrink-0" /> : <FaChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
