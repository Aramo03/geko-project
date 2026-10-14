import React, { useState } from "react";
import "./HeroMedia.css";

export default function HeroMedia() {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    category: "",
    whatsapp: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-screen flex items-center justify-center overflow-hidden bg-emerald-950 py-12 px-6 sm:px-10 lg:px-16 my-[-2rem]">
      {/* Background Image with 100% width and height coverage */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src="/images/mainLoad.webp"
          alt="Classroom background"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-emerald-950/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container spanning safe max-width inside the full-width section */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 sm:px-8">
        {/* Left Side: Hero Text & Buttons */}
        <div className="lg:col-span-7 text-white space-y-6">
          <div className="inline-block bg-amber-400 text-gray-950 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
            Smart Future Pathways
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Learn. Grow. Achieve.
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed">
            Empower your child with structured education modules designed by
            global certified mentors. Interactive mathematical courses, modern
            robotics, and coding tracks custom-built for creative and logical
            development.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#courses"
              className="px-7 py-3.5 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition duration-200"
            >
              Explore Courses
            </a>
            <a
              href="#trial"
              className="px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition duration-200 shadow-lg"
            >
              Free Trial Class
            </a>
          </div>
        </div>

        {/* Right Side: Registration Form Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-900 border border-gray-100">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              Enroll Today
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              A FREE TRIAL CLASS REGISTRATION
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
                required
              />
            </div>

            {/* Country & Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-gray-700 transition"
                >
                  <option value="">Select</option>
                  <option value="am">Armenia</option>
                  <option value="us">United States</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-gray-700 transition"
                >
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1-3</option>
                  <option value="2">Grade 4-6</option>
                </select>
              </div>
            </div>

            {/* WhatsApp & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+1 (000) 000-0000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
                  required
                />
              </div>
            </div>

            {/* Message (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="2"
                placeholder="Any notes or specific questions..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none transition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl transition duration-200 shadow-md uppercase tracking-wider text-sm mt-2"
            >
              Confirm Registration
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
