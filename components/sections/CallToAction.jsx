import { Phone, Mail } from "lucide-react";

export function CallToAction() {
  return (
    <section id="contact" className="bg-black">
      <div
        className="bg-red clip-cta relative overflow-hidden px-[8vw] py-24"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)",
        }}
      >
        <div className="relative z-10 flex flex-col flex-wrap items-start justify-between gap-6 sm:gap-10 lg:flex-row lg:items-center">
          {/* Text */}
          <div className="w-full lg:max-w-125">
            <div className="font-heading mb-4 text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase sm:text-[13px]">
              Start Your Project
            </div>
            <h2 className="font-heading mb-4 text-[clamp(24px,6vw,64px)] leading-[1.05] font-black text-white sm:text-[clamp(28px,4vw,64px)] sm:leading-[1.1]">
              LET&apos;S GET TO WORK TOGETHER
            </h2>
            <p className="max-w-full text-sm leading-[1.6] text-white/80 sm:text-base sm:leading-[1.7]">
              Whether you&apos;re a mining company, local institution, foreign
              investor, or private developer — Sayukha Construction brings the
              skills, equipment, and commitment to deliver. Operating across
              Tanzania, with safety and excellence in everything we do.
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3 sm:gap-4 lg:w-auto">
            <a
              href="tel:+255786968841"
              className="text-red font-heading clip-notch hover:bg-gray-light flex w-full items-center justify-center gap-2 bg-white px-4 py-3 text-xs font-black tracking-widest uppercase no-underline transition-all hover:-translate-y-0.5 sm:gap-3 sm:px-9 sm:py-4.5 sm:text-[15px] lg:w-auto"
            >
              <Phone size={16} strokeWidth={2.5} className="shrink-0" />
              <span>CALL US: +255 786 968 841</span>
            </a>
            <a
              href="mailto:info@sayukhaconstruction.co.tz"
              className="font-heading clip-notch flex w-full items-center justify-center gap-2 border border-white/50 bg-transparent px-4 py-3 text-xs font-bold tracking-[0.05em] text-white uppercase no-underline transition-all hover:-translate-y-0.5 hover:bg-white/10 sm:gap-3 sm:px-9 sm:py-4 sm:text-[15px] sm:tracking-[0.12em] lg:w-auto"
            >
              <Mail size={16} strokeWidth={2} className="shrink-0" />
              <span className="break-all">info@sayukhaconstruction.co.tz</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
