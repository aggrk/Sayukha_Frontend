import { testimonials } from "../../lib/data";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { FadeUp } from "../ui/FadeUp";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-dark py-24 px-[8vw]">
      <div className="mb-14">
        <SectionLabel text="Client Voices" />
        <h2 className="font-condensed font-black text-[clamp(36px,4vw,64px)] text-white-soft leading-none">
          WHAT CLIENTS SAY
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
        {testimonials.map((t, index) => (
          <FadeUp key={t.id} delay={index * 0.12}>
            <div className="bg-black p-10 border-t-[3px] border-transparent hover:border-green transition-colors h-full">
              <div className="font-condensed font-black text-[72px] text-green/40 leading-[0.8] mb-5">
                "
              </div>
              <p className="text-[15px] leading-[1.8] text-gray-soft mb-8 italic">
                {t.quote}
              </p>
              <div className="w-8 h-0.5 bg-green mb-5" />
              <div className="font-condensed font-bold text-lg text-white uppercase">
                {t.author}
              </div>
              <div className="text-xs text-gray-soft tracking-widest mt-1">
                {t.role}
              </div>
              <div className="text-[11px] text-green-light tracking-widest mt-0.5 uppercase font-semibold">
                {t.organization}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
