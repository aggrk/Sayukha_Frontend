import { SectionLabel } from "../../components/ui/SectionLabel";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "../../components/ui/ServiceIcon"; // Create icon map
import { FadeUp } from "../ui/FadeUp";
import { services } from "../../lib/data";

export function Services() {
  return (
    <section id="services" className="bg-dark py-24 px-[8vw]">
      {/* Header */}
      <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
        <div>
          <SectionLabel text="What We Do" />
          <h2 className="font-heading font-black text-[clamp(36px,4vw,64px)] text-white-soft leading-none">
            CORE SERVICES
          </h2>
        </div>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 border border-green/60 text-green-light px-9 py-4 font-heading text-[15px] font-bold tracking-[0.12em] uppercase clip-notch hover:bg-green/10 transition-all no-underline"
        >
          All Services →
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
        {services.map((service, index) => (
          <FadeUp key={service.id} delay={index * 0.08}>
            <div className="group bg-black p-10 relative cursor-pointer border-b-[3px] border-transparent hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Bottom accent bar on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-0.75 bg-red group-hover:w-full transition-all duration-300" />

              <div className="font-heading font-black text-5xl text-white/6 leading-none mb-5 group-hover:text-red transition-colors duration-300">
                {service.number}
              </div>

              <div className="w-12 h-12 text-green-light mb-5">
                <ServiceIcon name={service.icon} />
              </div>

              <h3 className="font-heading font-black text-2xl text-white-soft leading-[1.1] mb-3 uppercase">
                {service.title}
              </h3>

              <p className="text-sm leading-[1.7] text-gray-soft">
                {service.description}
              </p>

              <div className="absolute bottom-7 right-7 w-9 h-9 border border-white/10 flex items-center justify-center text-gray-soft group-hover:bg-red group-hover:border-red group-hover:text-white transition-all duration-300">
                <ArrowRight size={16} strokeWidth={2} />
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
