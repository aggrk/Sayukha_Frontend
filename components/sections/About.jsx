import { strengths } from "../../lib/data";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { FadeUp } from "../ui/FadeUp";

export function About() {
  return (
    <section
      id="about"
      className="bg-black py-24 px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
    >
      {/* Visual */}
      <FadeUp className="relative hidden lg:block">
        <div className="w-full aspect-4/5 bg-linear-to-br from-[#1a2a1a] to-[#0d1a0d] clip-building relative overflow-hidden">
          {/* Replace with next/image once images are available */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(11,107,58,0.04) 20px, rgba(11,107,58,0.04) 21px)",
            }}
          />
          {/* Placeholder SVG or Image */}
        </div>

        {/* Years badge */}
        <div
          className="absolute -bottom-5 -right-5 bg-red px-7 py-6"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <div className="font-heading font-black text-[52px] text-white leading-none">
            15+
          </div>
          <div className="text-[11px] font-semibold tracking-[0.15em] text-white/80 uppercase">
            Years of Excellence
          </div>
        </div>
      </FadeUp>

      {/* Content */}
      <div>
        <SectionLabel text="Who We Are" />
        <h2 className="font-heading font-black text-[clamp(36px,3.5vw,60px)] text-white-soft leading-none mb-6">
          BUILT ON <span className="text-green">DISCIPLINE.</span>
          <br />
          DRIVEN BY RESULTS.
        </h2>

        <p className="text-base leading-[1.8] text-gray-soft mb-6">
          Sayukha Construction is Tanzania's leading civil engineering firm with
          over 15 years of experience delivering mission-critical infrastructure
          projects. We operate across all 12 mainland regions, serving
          government ministries, local authorities, private developers, and
          international investors.
        </p>
        <p className="text-base leading-[1.8] text-gray-soft mb-10">
          Our workforce of over 400 skilled engineers, technicians, and site
          operatives brings unmatched execution capacity to projects of any
          scale — from rural roads to urban high-rises.
        </p>

        <div className="grid grid-cols-2 gap-0.5">
          {strengths.map((strength, index) => (
            <FadeUp key={strength.id} delay={index * 0.1}>
              <div className="bg-dark p-6 border-l-[3px] border-green">
                <h4 className="font-heading font-black text-lg text-white tracking-[0.05em] uppercase mb-1.5">
                  {strength.title}
                </h4>
                <p className="text-[13px] leading-[1.6] text-gray-soft">
                  {strength.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
