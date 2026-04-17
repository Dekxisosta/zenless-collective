import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../components/user/Logo";
import cart from "../../assets/images/cart.png";
import user from "../../data/mock-profile.gif";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="px-6 flex items-center relative">

        {/* LEFT NAV */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-sm font-medium transition"
              style={{
                color: isActive(link.to)
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              }}
            >
              {link.label}

              <span
                className="absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: isActive(link.to) ? "100%" : "0%",
                  backgroundColor: "var(--color-primary)",
                }}
              />
            </Link>
          ))}
        </div>

        {/* CENTER LOGO */}
        <Link
          to="/"
          className="absolute w-[36rem] left-1/2 -translate-x-1/2 flex items-center"
        >
          <Logo className="relative z-10" />
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-3 ml-auto">

          {/* LOGIN */}
          <Link
            to="/login"
            className="text-sm px-3 py-1.5 rounded-lg border transition hover:bg-white/10"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            Login
          </Link>

          {/* SIGNUP */}
          <Link
            to="/signup"
            className="text-sm px-3 py-1.5 rounded-lg font-medium transition"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            Sign Up
          </Link>

          {/* THEME */}
          <button
            onClick={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            className="text-xs px-3 py-1.5 rounded-lg border transition"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {/* USER */}
          <Link to="/profile">
            <img
              src={user}
              className="w-8 h-8 opacity-70 hover:opacity-100 transition"
            />
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            <img src={cart} className="w-4 h-4 invert" />
            Cart
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden ml-auto flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-6 h-[2px]"
              style={{ backgroundColor: "var(--color-text)" }}
            />
          ))}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        className={`md:hidden absolute left-4 right-4 top-full mt-2 p-4 rounded-xl transition-all duration-200 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-3">

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                color: isActive(link.to)
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="text-sm"
            style={{ color: "var(--color-text)" }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Sign Up
          </Link>

          <button
            onClick={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            className="text-sm px-3 py-2 rounded-lg border w-fit"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white w-fit"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <img src={cart} className="w-4 h-4 invert" />
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}