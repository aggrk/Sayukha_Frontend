import { SectionLabel } from "../../components/ui/SectionLabel";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "../../components/ui/ServiceIcon"; // Create icon map
import { FadeUp } from "../ui/FadeUp";
import { services } from "../../lib/data";

export function Services() {
  return (
    <section id="services" className="bg-dark px-[8vw] py-24">
      {/* Header */}
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel text="What We Do" />
          <h2 className="font-heading text-white-soft text-[clamp(36px,4vw,64px)] leading-none font-black">
            OUR SERVICES
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-0.5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <FadeUp key={service.id} delay={index * 0.08}>
            <div className="group relative cursor-pointer overflow-hidden border-b-[3px] border-transparent bg-black p-10 transition-all duration-300 hover:-translate-y-1">
              {/* Bottom accent bar on hover */}
              <div className="bg-red absolute bottom-0 left-0 h-0.75 w-0 transition-all duration-300 group-hover:w-full" />

              <div className="font-heading group-hover:text-red mb-5 text-5xl leading-none font-black text-white/6 transition-colors duration-300">
                {service.number}
              </div>

              <div className="text-green-light mb-5 h-12 w-12">
                <ServiceIcon name={service.icon} />
              </div>

              <h3 className="font-heading text-white-soft mb-3 text-2xl leading-[1.1] font-black uppercase">
                {service.title}
              </h3>

              <p className="text-gray-soft text-sm leading-[1.7]">
                {service.description}
              </p>

              <div className="text-gray-soft group-hover:bg-red group-hover:border-red absolute right-7 bottom-7 flex h-9 w-9 items-center justify-center border border-white/10 transition-all duration-300 group-hover:text-white">
                <ArrowRight size={16} strokeWidth={2} />
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
