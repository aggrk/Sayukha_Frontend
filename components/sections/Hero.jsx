"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { FadeUp } from "../ui/FadeUp";

const heroStats = [
  { value: "180+", label: "Projects Completed" },
  { value: "15+", label: "Years Operating" },
  { value: "12", label: "Regions Covered" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden pt-8 sm:pt-18"
      style={{
        background: `
          linear-gradient(135deg, rgba(11,107,58,0.08) 0%, transparent 50%),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px),
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px),
          #0F0F0F
        `,
      }}
    >
      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-[42%] w-px h-full opacity-30"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #0B6B3A 30%, #0B6B3A 70%, transparent)",
          transform: "skewX(-8deg)",
        }}
      />

      {/* Left: Content */}
      <div className="flex flex-col justify-center px-[8vw] py-20 relative z-10">
        <FadeUp>
          <div className="inline-flex items-center gap-2.5 bg-green/15 border border-green/40 px-4 py-2 mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-light animate-pulse" />
            <span className="font-heading text-[11px] font-bold tracking-[0.18em] text-green-light uppercase">
              Certified Civil Engineers · Tanzania
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="font-heading font-black leading-[0.92] mb-7 text-[clamp(40px,7vw,92px)] md:text-[clamp(38px,7vw,80px)]">
            <span className="text-white-soft block">WE BUILD</span>
            <span className="text-red block">STRUCTURES</span>
            <span
              className="block"
              style={{
                WebkitTextStroke:
                  "clamp(1px, 0.2vw, 2px) rgba(255,255,255,0.3)",
                color: "transparent",
              }}
            >
              THAT ENDURES
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-base font-light leading-[1.7] text-gray-soft max-w-115 mb-11">
            From roads that connect communities to buildings that define
            skylines — Sayukha Construction delivers large-scale civil
            engineering projects across Tanzania with precision, safety, and
            proven capacity.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="#contact"
              className="inline-flex items-center gap-3 bg-red text-white px-9 py-4 font-heading text-[15px] font-bold tracking-[0.12em] uppercase clip-notch hover:bg-red-dark transition-all hover:-translate-y-0.5 no-underline"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
              Request Consultation
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center gap-3 bg-transparent text-green-light px-9 py-4 font-heading text-[15px] font-bold tracking-[0.12em] uppercase clip-notch border border-green/60 hover:bg-green/10 transition-all hover:-translate-y-0.5 no-underline"
            >
              <Play size={18} strokeWidth={2.5} />
              View Our Projects
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex gap-10">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading font-black text-4xl text-white leading-none">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium tracking-[0.15em] text-gray-soft uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:block relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0F0F0F 0%, transparent 30%), linear-gradient(135deg, #1a2a1a 0%, #0a1a0a 50%, #1a0a0a 100%)",
          }}
        />
        {/* You'd replace this with next/image once real photos are available */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Architectural SVG placeholder - replace with <Image /> */}
          <Image
            src="/images/hero-bg.jpg"
            alt="Journey from religious dogma to independent thought"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
