import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/properties")
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-rose-100 text-slate-900 font-inter relative">
      <div className="absolute -z-10 top-[-120px] left-[-120px] w-96 h-96 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute -z-10 bottom-[-120px] right-[-120px] w-96 h-96 rounded-full bg-rose-300/30 blur-3xl" />

      <section className="text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-slate-900 drop-shadow font-[Playfair Display] leading-tight">
          Where<br /> Living Begins.
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-600">
          Explore thoughtfully curated listings, crafted to match your lifestyle and aspirations.
        </p>
        <Link
          to="/properties"
          className="inline-block bg-rose-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition hover:-translate-y-0.5"
        >
          Browse Properties
        </Link>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-8" />

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {[{
            icon: "🏙️",
            title: "Urban Comfort",
            desc: "Modern spaces in vibrant cityscapes."
          }, {
            icon: "🌿",
            title: "Natural Escapes",
            desc: "Homes surrounded by green tranquility."
          }, {
            icon: "💼",
            title: "Professional Guidance",
            desc: "Expert assistance for buyers and sellers alike."
          }].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-lg border border-rose-200 rounded-xl p-8 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="mx-auto w-fit max-w-full backdrop-blur-lg bg-white/60 border border-rose-200 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center pt-8 px-4">Featured Listings</h2>
          {featured.length === 0 ? (
            <p className="pb-10 px-8 text-slate-700 text-center">No featured properties yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 pb-10 px-8">
              {featured.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="w-[300px] bg-white overflow-hidden rounded-2xl shadow hover:shadow-xl transition hover:-translate-y-1"
                >
                  <img
                    src={property.images?.[0] || "/placeholder.jpg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800">{property.title}</h3>
                    <p className="text-slate-600">{property.location}</p>
                    <p className="text-rose-600 font-bold mt-2">₹ {property.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-14 bg-orange-50 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-slate-800">Find Your Next Move</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Apartments", "Villas", "Commercial", "Plots", "Luxury"].map((type) => (
            <Link
              key={type}
              to={`/properties?type=${encodeURIComponent(type)}`}
              className="bg-white hover:bg-orange-100 px-6 py-3 rounded-full text-rose-600 shadow-sm hover:shadow transition border border-rose-200"
            >
              {type}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-rose-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["+500", "Happy Clients"],
            ["120+", "Verified Listings"],
            ["24/7", "Support Available"],
            ["100%", "Secure Deals"]
          ].map(([num, label]) => (
            <div key={label}>
              <h3 className="text-4xl font-bold text-rose-700">{num}</h3>
              <p className="text-rose-600 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-8 text-slate-800">Browse by Lifestyle</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {["🌇 City Living", "🌳 Suburban Peace", "🏞️ Nature Retreats", "🏢 Corporate Hubs"].map((item) => {
            const [emoji, ...rest] = item.split(" ");
            const label = rest.join(" ");
            return (
              <div
                key={label}
                className="bg-rose-50 p-6 rounded-xl hover:shadow-xl transition hover:-translate-y-1 flex flex-col items-center gap-2 border border-orange-200"
              >
                <div className="text-4xl">{emoji}</div>
                <h4 className="text-lg font-medium text-rose-700 text-center">{label}</h4>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-orange-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12 text-slate-800">Hear From Our Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Aarav Mehta", quote: "The platform helped me find my dream home within days. Smooth, secure and simple!" },
            { name: "Priya Sharma", quote: "Incredible listings and responsive support. It made home-hunting exciting again!" },
            { name: "Vikram Nair", quote: "Very professional agents and everything was verified. Highly recommend!" },
          ].map(({ name, quote }) => (
            <div key={name} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-rose-200">
              <p className="italic text-slate-600">“{quote}”</p>
              <h4 className="mt-4 font-semibold text-rose-700">{name}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-rose-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Property Journey?</h2>
        <p className="text-rose-100 mb-6">Let’s find a space that matches your dreams.</p>
        <Link
          to="/contact"
          className="inline-block bg-white text-rose-600 font-semibold px-8 py-4 rounded-full shadow hover:bg-rose-50 transition hover:-translate-y-0.5"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
