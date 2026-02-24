import Image from "next/image";
import { projects } from "../../lib/data";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { MapPin } from "lucide-react";
import { FadeUp } from "../ui/FadeUp";

export function Projects() {
  return (
    <section id="projects" className="bg-gray-light py-24 px-[8vw]">
      <div className="flex justify-between items-end mb-12 flex-wrap gap-5">
        <div>
          <SectionLabel text="Our Portfolio" accentColor="green" />
          <h2 className="font-heading font-black text-[clamp(36px,4vw,64px)] text-black leading-none">
            SELECTED <span className="text-green">PROJECTS</span>
          </h2>
        </div>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 bg-red text-white px-9 py-4 font-heading text-[15px] font-bold tracking-[0.12em] uppercase clip-notch hover:bg-red-dark transition-all no-underline"
        >
          View All Projects
        </a>
      </div>

      <div
        className="grid grid-cols-12 gap-1"
        style={{ gridTemplateRows: "280px 280px" }}
      >
        {projects.map((project) => (
          <FadeUp
            key={project.id}
            className={`relative overflow-hidden col-span-12 md:col-span-6 lg:col-span-${project.colSpan}`}
          >
            <div className="group h-full cursor-pointer">
              {/* Background Image */}
              <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.06]">
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-7"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                }}
              >
                <span className="inline-block bg-red text-white px-3 py-1 font-heading text-[11px] font-bold tracking-[0.15em] uppercase mb-2.5 w-fit">
                  {project.tag}
                </span>
                <h3 className="font-heading font-black text-xl text-white leading-[1.1]">
                  {project.title}
                </h3>
                <p className="text-xs flex items-center space-x-1 text-white/60 mt-1.5 tracking-[0.05em]">
                  <MapPin className="h-5 w-5" />
                  <span>{project.location}</span>
                </p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
