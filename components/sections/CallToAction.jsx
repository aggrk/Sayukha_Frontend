import { Phone, Mail } from "lucide-react";

export function CallToAction() {
  return (
    <section id="contact" className="bg-black">
      <div
        className="bg-red px-[8vw] py-24 relative overflow-hidden clip-cta"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)",
        }}
      >
        <div className="relative z-10 flex items-center justify-between gap-10 flex-wrap">
          {/* Text */}
          <div>
            <div className="font-heading text-[13px] font-bold tracking-[0.25em] uppercase text-white/60 mb-4">
              Start Your Project
            </div>
            <h2 className="font-heading font-black text-[clamp(36px,4vw,64px)] text-white leading-[0.95] mb-4">
              LET&apos;S BUILD
              <br />
              SOMETHING THAT
              <br />
              MATTERS
            </h2>
            <p className="text-base text-white/80 max-w-120 leading-[1.7]">
              Whether you&apos;re a government ministry, private developer, or
              international investor — Sayukha Construction is ready to bring
              your infrastructure vision to life.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 min-w-70">
            <a
              href="tel:+255740000000"
              className="flex items-center justify-center gap-3 bg-white text-red px-9 py-4.5 font-heading text-[15px] font-black tracking-[0.12em] uppercase clip-notch hover:bg-gray-light transition-all hover:-translate-y-0.5 no-underline"
            >
              <Phone size={18} strokeWidth={2.5} />
              Call Us: +255 786 968 841
            </a>
            <a
              href="mailto:info@temboconstruct.co.tz"
              className="flex items-center justify-center gap-3 bg-transparent text-white px-9 py-4 font-heading text-[15px] font-bold tracking-[0.12em] uppercase clip-notch border border-white/50 hover:bg-white/10 transition-all hover:-translate-y-0.5 no-underline"
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
