"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { FadeUp } from "../ui/FadeUp";

const heroStats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "4+", label: "Years of Trust" },
  { value: "8", label: "Regions Served" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative grid min-h-screen grid-cols-1 overflow-hidden pt-8 sm:pt-18 lg:grid-cols-2"
      style={{
        background: `
          linear-gradient(135deg, rgba(11,107,58,0.08) 0%, transparent 50%),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px),
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px),
          #0F0F0F
        `,
      }}
    >
      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center px-[8vw] py-20">
        <FadeUp>
          <div className="bg-green/15 border-green/40 mb-8 inline-flex w-fit items-center gap-2.5 border px-4 py-2">
            <span className="bg-green-light h-2 w-2 animate-pulse rounded-full" />
            <span className="font-heading text-green-light text-[11px] font-bold tracking-[0.18em] uppercase">
              Multi-Engineering & Supplies · Tanzania
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="font-heading mb-7 text-[clamp(40px,7vw,92px)] leading-[0.92] font-black md:text-[clamp(38px,7vw,80px)]">
            <span className="text-white-soft block">WHERE TOOLS</span>
            <span className="text-red block">MEET SKILL,</span>
            <span
              className="block"
              style={{
                WebkitTextStroke:
                  "clamp(1px, 0.2vw, 2px) rgba(255,255,255,0.3)",
                color: "transparent",
              }}
            >
              WORK GETS DONE.
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-gray-soft mb-11 max-w-115 text-base leading-[1.7] font-light">
            From the depths of a mine to the floor of a workshop — Sayukha
            Construction supplies the expertise, equipment, and industrial
            muscle to keep Tanzania's toughest operations running. Mining,
            electrical, metal works, safety gear, and beyond. One partner. Zero
            compromise.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="mb-14 flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-4">
            <Link
              href="#contact"
              className="bg-red font-heading clip-notch hover:bg-red-dark inline-flex w-full flex-wrap items-center gap-2 px-4 py-3 text-sm font-bold tracking-[0.12em] text-white uppercase no-underline transition-all hover:-translate-y-0.5 sm:w-auto sm:gap-3 sm:px-9 sm:py-4 sm:text-[15px]"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
              Request a Quote
            </Link>
            <Link
              href="#services"
              className="text-green-light font-heading clip-notch border-green/60 hover:bg-green/10 inline-flex w-full flex-wrap items-center gap-2 border bg-transparent px-4 py-3 text-sm font-bold tracking-[0.12em] uppercase no-underline transition-all hover:-translate-y-0.5 sm:w-auto sm:gap-3 sm:px-9 sm:py-4 sm:text-[15px]"
            >
              <Play size={18} strokeWidth={2.5} />
              Explore Our Services
            </Link>
          </div>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="flex items-center justify-center gap-6 sm:flex-row sm:gap-10">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-4xl leading-none font-black text-white sm:text-5xl">
                  {stat.value}
                </div>
                <div className="text-gray-soft mt-1 text-[11px] font-medium tracking-[0.15em] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* Right: Visual */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0F0F0F 0%, transparent 30%), linear-gradient(135deg, #1a2a1a 0%, #0a1a0a 50%, #1a0a0a 100%)",
          }}
        /> */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/hero-bg.jpg"
            alt="Sayukha Construction — Industrial engineering at work"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
