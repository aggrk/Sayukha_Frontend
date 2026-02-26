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
      className={`fixed top-0 right-0 left-0 z-50 flex h-18 items-center justify-between px-[5vw] transition-all duration-300 ${
        scrolled
          ? "border-b border-white/6 bg-black/95 backdrop-blur-xl"
          : "bg-black/70 backdrop-blur-sm"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center">
          {/* <span className="font-heading font-black text-lg text-white">S</span>
           */}
          <Image src="/logo.png" alt="logo" width={150} height={200} />
        </div>
        <div className="font-heading text-white-soft text-xl leading-none font-black tracking-[0.08em]">
          SAYUKHA CONSTRUCTION LTD
          <span className="text-gray-soft mt-0.5 block text-[10px] font-normal tracking-[0.2em]">
            CONSTRUCTION COMPANY · TANZANIA
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <ul className="hidden list-none items-center gap-9 md:flex">
        {[
          { label: "Services", href: "#services" },
          { label: "About", href: "#about" },
          { label: "Projects", href: "#projects" },
        ].map((link) => (
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
            href="login"
            className="font-heading bg-red clip-notch-sm hover:bg-red-dark px-6 py-2.5 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-colors"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}
