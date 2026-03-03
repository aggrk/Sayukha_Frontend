import { strengths } from "../../lib/data";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { FadeUp } from "../ui/FadeUp";
import Image from "next/image";

export function About() {
  return (
    <section
      id="about"
      className="grid grid-cols-1 items-center gap-20 bg-black px-[8vw] py-24 lg:grid-cols-2"
    >
      {/* Visual */}
      <FadeUp className="relative hidden lg:block">
        <div className="clip-building relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1a2a1a] to-[#0d1a0d]">
          <Image
            src="/images/about.jpeg"
            alt="About Sayukha Construction"
            fill
          />
        </div>

        {/* Years badge */}
        <div
          className="bg-red absolute -right-5 -bottom-5 px-7 py-6"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <div className="font-heading text-[52px] leading-none font-black text-white">
            4+
          </div>
          <div className="text-[11px] font-semibold tracking-[0.15em] text-white/80 uppercase">
            Years of Excellence
          </div>
        </div>
      </FadeUp>

      {/* Content */}
      <div>
        <SectionLabel text="Who We Are" />
        <h2 className="font-heading text-white-soft mb-6 text-[clamp(28px,5vw,60px)] leading-snug font-black sm:leading-none">
          BUILT ON <span className="text-green">VALUES.</span>
          <br />
          DRIVEN BY PURPOSE.
        </h2>
        <p className="text-gray-soft mb-6 text-sm leading-[1.6] sm:text-base sm:leading-[1.8]">
          Sayukha Construction Company Limited is one of Tanzania's
          fastest-growing multi-engineering and supplies firms. We serve
          individuals, public and private institutions, and local and foreign
          investors — primarily within the mining and geology sectors — across
          Tanzania.
        </p>
        <p className="text-gray-soft mb-10 text-sm leading-[1.6] sm:text-base sm:leading-[1.8]">
          Our team is continuously trained on the latest technologies and
          industry trends, equipping us with the knowledge and skill to tackle
          any challenge our clients bring — with safety as a non-negotiable
          foundation in everything we do.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {strengths.map((strength, index) => (
            <FadeUp key={strength.id} delay={index * 0.1}>
              <div className="bg-dark border-green border-l-[3px] p-6">
                <h4 className="font-heading wrap-break-words mb-1.5 text-base font-black tracking-[0.05em] text-white uppercase sm:text-lg">
                  {strength.title}
                </h4>
                <p className="text-gray-soft text-[13px] leading-[1.6]">
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
