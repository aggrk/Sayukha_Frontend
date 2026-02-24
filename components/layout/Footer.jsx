import Link from "next/link";
import {
  Linkedin,
  Twitter,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  "Home",
  "Services",
  "About",
  "Projects",
  "Testimonials",
  "Contact",
];
const serviceLinks = [
  "Road Construction",
  "Building Works",
  "Infrastructure",
  "Civil Engineering",
  "Structural Works",
  "Project Management",
];

export function Footer() {
  return (
    <footer className="bg-dark border-t border-white/6 pt-18">
      <div className="px-[8vw]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15 pb-15 border-b border-white/6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9.5 h-9.5 bg-red clip-logo flex items-center justify-center">
                <span className="font-heading font-black text-lg text-white">
                  S
                </span>
              </div>
              <div className="font-heading font-black text-xl text-white-soft tracking-[0.08em] leading-none">
                SAYUKHA CONSTRUCTION
                <span className="block text-[10px] font-normal tracking-[0.2em] text-gray-soft mt-0.5">
                  CIVIL ENGINEERING · TANZANIA
                </span>
              </div>
            </div>
            <p className="text-sm leading-[1.7] text-gray-soft mb-7 max-w-75">
              Tanzania&apos;s trusted civil engineering partner. Building the
              infrastructure that connects communities, drives commerce, and
              shapes the nation&apos;s future.
            </p>
            <div className="flex gap-3">
              {["ISO 9001", "OSHA Certified", "BRELA Reg."].map((cert) => (
                <span
                  key={cert}
                  className="border border-white/12 px-3.5 py-1.5 font-heading text-[11px] font-bold tracking-widest text-gray-soft uppercase"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-heading text-sm font-black tracking-[0.2em] uppercase text-white mb-6">
              Navigation
            </div>
            <ul className="list-none space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-gray-soft hover:text-white transition-colors no-underline flex items-center gap-2"
                  >
                    <span className="text-red">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="font-heading text-sm font-black tracking-[0.2em] uppercase text-white mb-6">
              Services
            </div>
            <ul className="list-none space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm text-gray-soft hover:text-white transition-colors no-underline flex items-center gap-2"
                  >
                    <span className="text-red">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-heading text-sm font-black tracking-[0.2em] uppercase text-white mb-6">
              Contact
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: <MapPin className="h-5 w-5" />,
                  label: "Head Office",
                  content: "Plot 234, Nyasaka Road, Ilemela\nMwanza, Tanzania",
                },
                {
                  icon: <Phone className="h-5 w-5" />,
                  label: "Phone",
                  content: "+255 786 968 841",
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  label: "Email",
                  content:
                    "info@sayukhaconstruction.co.tz\nprojects@sayukhaconstruction.co.tz",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <strong className="block text-sm text-white font-medium mb-0.5">
                      {item.label}
                    </strong>
                    <span className="text-sm text-gray-soft leading-[1.6] whitespace-pre-line">
                      {item.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex justify-between items-center py-6 flex-wrap gap-4">
          <p className="text-xs text-white/30 tracking-[0.08em]">
            © 2026 Sayukha Construction Ltd. All rights reserved. | Registered
            in Tanzania | BRELA No. 0012345
          </p>
          <div className="flex gap-3">
            {[
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Facebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 bg-white/5 flex items-center justify-center text-gray-soft hover:bg-green hover:text-white transition-all clip-logo no-underline"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
