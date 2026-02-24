"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-18 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-white/6"
          : "bg-black/70 backdrop-blur-sm"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-9.5 h-9.5  flex items-center justify-center shrink-0">
          {/* <span className="font-heading font-black text-lg text-white">S</span>
           */}
          <Image src="/logo.png" alt="logo" width={150} height={200} />
        </div>
        <div className="font-heading font-black text-xl text-white-soft tracking-[0.08em] leading-none">
          SAYUKHA CONSTRUCTION
          <span className="block text-[10px] font-normal tracking-[0.2em] text-gray-soft mt-0.5">
            CIVIL ENGINEERING · TANZANIA
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-9 list-none">
        {[
          { label: "Services", href: "#services" },
          { label: "About", href: "#about" },
          { label: "Projects", href: "#projects" },
          { label: "Testimonials", href: "#testimonials" },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-heading font-semibold text-sm tracking-[0.12em] uppercase text-gray-soft hover:text-white transition-colors no-underline"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#contact"
            className="font-heading font-bold text-sm tracking-[0.12em] uppercase text-white bg-red px-6 py-2.5 clip-notch-sm hover:bg-red-dark transition-colors no-underline"
          >
            Get a Quote
          </a>
        </li>
        <li>
          <Link
            href="login"
            className="font-heading font-bold text-sm tracking-[0.12em] uppercase text-white bg-red px-6 py-2.5 clip-notch-sm hover:bg-red-dark transition-colors no-underline"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}
