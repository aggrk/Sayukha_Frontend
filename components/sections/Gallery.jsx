"use client";
import Image from "next/image";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { FadeUp } from "../ui/FadeUp";
import { galleryItems } from "../../lib/data";

export function Gallery() {
  return (
    <section id="gallery" className="bg-dark px-[8vw] py-24">
      {/* Header */}
      <FadeUp>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel text="Our Works" />
            <h2 className="font-heading text-white-soft text-[clamp(36px,4vw,64px)] leading-none font-black">
              BUILT BY US.
              <br />
              <span className="text-red">PROOF IN EVERY FRAME.</span>
            </h2>
          </div>
        </div>
      </FadeUp>

      {/* Uniform Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {galleryItems.map((item, index) => (
          <FadeUp key={item.id} delay={index * 0.04}>
            <div className="group relative aspect-4/3 w-full overflow-hidden rounded-lg bg-[#111]">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 rounded-lg bg-black/0 transition-all duration-400 group-hover:bg-black/15" />
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Bottom CTA */}
      <FadeUp delay={0.3}>
        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="bg-red font-heading clip-notch hover:bg-red-dark inline-flex items-center gap-3 px-9 py-4 text-[15px] font-bold tracking-[0.12em] text-white uppercase no-underline transition-all hover:-translate-y-0.5"
          >
            Start a Project With Us →
          </a>
        </div>
      </FadeUp>
    </section>
  );
}
