import { SectionLabel } from "../../components/ui/SectionLabel";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "../../components/ui/ServiceIcon";
import { FadeUp } from "../ui/FadeUp";
import { services } from "../../lib/data";

export function Services() {
  return (
    <section id="services" className="bg-dark px-4 py-16 sm:px-[8vw] sm:py-24">
      {/* Header */}
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 sm:mb-16 sm:gap-6">
        <div>
          <SectionLabel text="What We Do" />
          <h2 className="font-heading text-white-soft text-[clamp(28px,5vw,64px)] leading-snug font-black sm:leading-none">
            OUR SERVICES
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {services.map((service, index) => (
          <FadeUp key={service.id} delay={index * 0.08}>
            <div className="group relative cursor-pointer overflow-hidden border-b-[3px] border-transparent bg-black p-6 transition-all duration-300 hover:-translate-y-1 sm:p-10">
              {/* Bottom accent bar on hover */}
              <div className="bg-red absolute bottom-0 left-0 h-0.75 w-0 transition-all duration-300 group-hover:w-full" />

              <div className="font-heading group-hover:text-red mb-5 text-3xl leading-none font-black text-white/6 transition-colors duration-300 sm:text-5xl">
                {service.number}
              </div>

              <div className="text-green-light mb-5 h-12 w-12">
                <ServiceIcon name={service.icon} />
              </div>

              <h3 className="font-heading text-white-soft mb-3 text-xl leading-[1.1] font-black uppercase sm:text-2xl">
                {service.title}
              </h3>

              <p className="text-gray-soft text-sm leading-[1.6] sm:leading-[1.7]">
                {service.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
