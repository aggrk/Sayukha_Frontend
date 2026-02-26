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
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-10">
          {/* Text */}
          <div>
            <div className="font-heading mb-4 text-[13px] font-bold tracking-[0.25em] text-white/60 uppercase">
              Start Your Project
            </div>
            <h2 className="font-heading mb-4 text-[clamp(36px,4vw,64px)] leading-[0.95] font-black text-white">
              LET&apos;S GET
              <br />
              TO WORK
              <br />
              TOGETHER
            </h2>
            <p className="max-w-120 text-base leading-[1.7] text-white/80">
              Whether you&apos;re a mining company, local institution, foreign
              investor, or private developer — Sayukha Construction brings the
              skills, equipment, and commitment to deliver. Operating across
              Tanzania, with safety and excellence in everything we do.
            </p>
          </div>

          {/* Actions */}
          <div className="flex min-w-70 flex-col gap-4">
            <a
              href="tel:+255740000000"
              className="text-red font-heading clip-notch hover:bg-gray-light flex items-center justify-center gap-3 bg-white px-9 py-4.5 text-[15px] font-black tracking-[0.12em] uppercase no-underline transition-all hover:-translate-y-0.5"
            >
              <Phone size={18} strokeWidth={2.5} />
              Call Us: +255 786 968 841
            </a>
            <a
              href="mailto:info@temboconstruct.co.tz"
              className="font-heading clip-notch flex items-center justify-center gap-3 border border-white/50 bg-transparent px-9 py-4 text-[15px] font-bold tracking-[0.12em] text-white uppercase no-underline transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Mail size={18} strokeWidth={2} />
              info@sayukhaconstruction.co.tz
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
