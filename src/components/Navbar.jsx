import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const nav = [
    { to: "/", label: "ROOV", brand: true },
    { to: "/", label: "Home" },
    { to: "/properties", label: "Properties" },
    { to: "/admin", label: "Admin" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-pink-50/70 backdrop-blur-md border-b border-pink-200 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-3">
      <ul className="flex justify-evenly items-center">
  {nav.map(({ to, label, brand }) => (
    <li key={`${to}-${label}`}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            brand ? "font-bungee text-2xl tracking-wide" : "font-medium",
            "text-pink-700",
            isActive && !brand && "text-pink-500 underline underline-offset-4",
            "hover:text-pink-500 hover:-translate-y-0.5",
            "transition duration-200 transform",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        {label}
      </NavLink>
    </li>
  ))}
</ul>
      </nav>
    </header>
  );
}
