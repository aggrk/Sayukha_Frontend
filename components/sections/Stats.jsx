import { stats } from "../../lib/data";
import { AnimatedCounter } from "../ui/AnimatedCounter";

export function Stats() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-[8vw]"
      style={{ background: "#0B6B3A" }}
    >
      {/* Diagonal pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(0,0,0,0.04) 30px, rgba(0,0,0,0.04) 31px)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="border-t-[3px] border-white/15 bg-black/15 px-6 py-8 text-center transition-colors hover:bg-black/25 sm:px-9 sm:py-12"
          >
            <div className="font-condensed mb-2 text-4xl leading-none font-black text-white sm:text-[72px]">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase sm:text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
