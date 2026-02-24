import { stats } from "../../lib/data";
import { AnimatedCounter } from "../ui/AnimatedCounter";

export function Stats() {
  return (
    <section
      className="relative py-20 px-[8vw] overflow-hidden"
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

      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-0.5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-black/15 px-9 py-12 text-center border-t-[3px] border-white/15 hover:bg-black/25 transition-colors"
          >
            <div className="font-condensed font-black text-[72px] text-white leading-none mb-2">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
