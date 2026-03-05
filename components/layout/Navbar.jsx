"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  // { label: "Projects", href: "#projects" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const burgerTop = menuOpen ? "translate-y-2 rotate-45" : "";
  const burgerMid = menuOpen ? "opacity-0" : "";
  const burgerBot = menuOpen ? "-translate-y-2 -rotate-45" : "";

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 flex h-18 items-center justify-between px-[5vw] transition-all duration-300 ${
          scrolled
            ? "border-b border-white/6 bg-black/95 backdrop-blur-xl"
            : "bg-black/70 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline sm:gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-9.5 sm:w-9.5">
            <Image
              src="/logo.png"
              alt="logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-white-soft text-sm leading-none font-black tracking-[0.06em] sm:text-xl sm:tracking-[0.08em]">
              SAYUKHA CONSTRUCTION LTD
            </span>
            <span className="text-gray-soft mt-0.5 text-[8px] font-normal tracking-[0.15em] sm:text-[10px] sm:tracking-[0.2em]">
              CONSTRUCTION COMPANY · TANZANIA
            </span>
          </div>
        </Link>

        {/* Nav Links - Desktop */}
        <ul className="hidden list-none items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-heading text-gray-soft text-sm font-semibold tracking-[0.12em] uppercase no-underline transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="font-heading bg-red clip-notch-sm hover:bg-red-dark px-6 py-2.5 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-colors"
            >
              Get a Quote
            </a>
          </li>
          <li>
            <Link
              href={`${user?.data ? "dashboard" : "login"}`}
              className="font-heading bg-red clip-notch-sm hover:bg-red-dark px-6 py-2.5 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-colors"
            >
              {user?.data ? "Go to Dashboard" : "Sign In"}
            </Link>
          </li>
        </ul>

        {/* Hamburger Button - Mobile only */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${burgerTop}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${burgerMid}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${burgerBot}`}
          />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="h-18" />
        <ul className="flex flex-1 list-none flex-col items-center justify-center gap-6 px-[5vw] sm:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={closeMenu}
                className="font-heading text-gray-soft text-center text-xl font-semibold tracking-[0.12em] uppercase no-underline transition-colors hover:text-white sm:text-2xl"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={closeMenu}
              className="font-heading bg-red clip-notch-sm hover:bg-red-dark px-4 py-2 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-colors sm:px-6 sm:py-2.5"
            >
              Get a Quote
            </a>
          </li>
          <li>
            <Link
              href="login"
              onClick={closeMenu}
              className="font-heading bg-red clip-notch-sm hover:bg-red-dark px-4 py-2 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-colors sm:px-6 sm:py-2.5"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
