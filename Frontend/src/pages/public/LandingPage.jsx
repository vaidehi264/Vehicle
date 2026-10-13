import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storageService } from "../../utils/storage";
import {
  FaWrench,
  FaShieldAlt,
  FaCarSide,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaTruckPickup,
  FaTools,
  FaMicrochip,
  FaSnowflake,
  FaBolt,
  FaOilCan,
} from "react-icons/fa";

export const LandingPage = () => {
  const navigate = useNavigate();
  const services = storageService.getServices();
  const mechanics = storageService.getMechanics();
  const reviews = storageService.getReviews();

  // Quick estimator state
  const [selectedMake, setSelectedMake] = useState("Hyundai");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "srv-001");

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleQuickBook = () => {
    navigate(`/user/book-service?serviceId=${selectedServiceId}`);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide">
                <FaShieldAlt className="w-3.5 h-3.5" />
                <span>Next-Gen Automotive Service Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Precision Car Care <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                  Powered by Master Mechanics
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Book OEM-certified periodic maintenance, computerized diagnostics, brake overhauls, and detailing with transparent pricing, live progress tracking, and doorstep pickup.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/user/book-service"
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2 group"
                >
                  <span>Schedule Service</span>
                  <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/services"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Explore Packages
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-3.5 text-xs font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                >
                  Explore 3-Panel Demos →
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 text-left">
                <div>
                  <h4 className="text-2xl font-black text-slate-900">15,000+</h4>
                  <p className="text-xs text-slate-500 font-medium">Cars Serviced</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-orange-600">4.9 ★</h4>
                  <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">120+</h4>
                  <p className="text-xs text-slate-500 font-medium">Garages Across India</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-emerald-600">1000 km</h4>
                  <p className="text-xs text-slate-500 font-medium">Service Warranty</p>
                </div>
              </div>
            </div>

            {/* Right Quick Booking Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
                <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-md">
                  Instant Quote
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1">Quick Service Estimator</h3>
                <p className="text-xs text-slate-500 mb-6">Select your car and service for upfront transparent pricing.</p>

                <div className="space-y-4">
                  {/* Select Car Make */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vehicle Brand</label>
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="Hyundai">Hyundai (Creta, i20, Verna)</option>
                      <option value="Honda">Honda (City, Civic, Elevate)</option>
                      <option value="Maruti Suzuki">Maruti Suzuki (Swift, Baleno, Brezza)</option>
                      <option value="Tata">Tata (Nexon, Harrier, Safari)</option>
                      <option value="Volkswagen">Volkswagen (Virtus, Taigun, Polo)</option>
                      <option value="BMW">BMW (3 Series, 5 Series, X1)</option>
                    </select>
                  </div>

                  {/* Select Service */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Desired Service Package</label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} — ₹{srv.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estimated Cost Preview Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Estimated Duration:</span>
                      <span className="text-slate-800 font-semibold">{selectedService?.estimatedDuration}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Doorstep Pickup & Drop:</span>
                      <span className="text-emerald-600 font-semibold">FREE Included</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-sm font-bold text-slate-900">Estimated Upfront Cost:</span>
                      <span className="text-2xl font-black text-orange-600">
                        ₹{selectedService?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleQuickBook}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Book {selectedMake}</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES GRID */}
      <section className="py-20 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Transparent Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Service Packages
            </h2>
            <p className="text-sm text-slate-600">
              Factory standard service guidelines executed using original equipment lubricants and certified replacement parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm hover:shadow-md shadow-slate-200/40 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                      <FaWrench className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <FaStar className="w-3 h-3 text-amber-500" /> {service.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 mb-6 text-xs text-slate-700">
                    {service.inclusions.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Starting at</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{service.price.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    to={`/user/book-service?serviceId=${service.id}`}
                    className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
            >
              <span>View All 8+ Service Packages</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How VV Cars Works
          </h2>
          <p className="text-sm text-slate-600">
            Automotive maintenance simplified into three easy digital stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Select Vehicle & Book</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add your vehicle make, choose a tailored service package, choose doorstep pickup or self drop-off, and select your preferred date slot.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Master Mechanic Assigned</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An OEM-certified technician receives your booking, conducts digital diagnostic scans, records findings, and repairs your car to factory spec.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Live Tracking & Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Follow every step through the live tracking stepper, view technician diagnosis notes, review final inspection checklist, and get your car delivered.
            </p>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED MECHANICS SPOTLIGHT */}
      <section className="py-20 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Verified Expertise
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Meet Our Master Technicians
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Every mechanic undergoes a rigorous 40-point background check and practical skill assessment.
              </p>
            </div>
            <Link
              to="/about"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
            >
              Learn about our certification standard →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mechanics.slice(0, 3).map((mech) => (
              <div
                key={mech.id}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm shadow-slate-200/50 transition-all"
              >
                <img
                  src={mech.avatar}
                  alt={mech.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">{mech.name}</h4>
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <FaStar className="w-3 h-3 text-amber-500" /> {mech.rating}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-orange-600">{mech.specialization}</p>
                  <p className="text-[11px] text-slate-500">{mech.experience} industry experience • {mech.completedJobs}+ jobs</p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {mech.skills.slice(0, 2).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Real Reviews
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            What Vehicle Owners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm shadow-slate-200/50"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="w-9 h-9 rounded-full object-cover border border-orange-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.userName}</h4>
                  <p className="text-[10px] text-slate-500">{rev.serviceName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-orange-600/20 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 max-w-2xl mx-auto">
            Ready for a Hassle-Free Vehicle Service Experience?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto mb-8">
            Join thousands of happy motorists enjoying doorstep pickup, transparent estimates, and guaranteed quality.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/user/book-service"
              className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Book Service Now
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-xl backdrop-blur-sm transition-all"
            >
              Explore 3-Panel Demos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
