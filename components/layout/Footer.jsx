import Image from "next/image";
import {
  Linkedin,
  Twitter,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

const navLinks = ["Home", "Services", "About", "Contact"];
const serviceLinks = [
  "Mechanical, Electrical & Civil Engineering",
  "Building Construction & Reconstruction",
  "Renovation, Rehabilitation & Maintenance",
  "Masonry, Metalworks & Finishing",
  "Road & Highway Construction",
  "Bridge & Infrastructure Works",
  "Water & Drainage Systems",
  "Earthmoving & Ground Works",
  "Underwater & Marine Construction",
  "Airport Runway Construction",
  "Subway Construction",
  "Roof Treatment, Repair & Service",
];

export function Footer() {
  return (
    <footer className="bg-dark border-t border-white/6 pt-12 sm:pt-18">
      <div className="px-[5vw] sm:px-[8vw]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/6 pb-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9.5 w-9.5 items-center justify-center">
                <Image src="/logo.png" alt="logo" width={200} height={200} />
              </div>
              <div className="font-heading text-white-soft text-lg leading-none font-black tracking-[0.08em] sm:text-xl">
                SAYUKHA CONSTRUCTION
                <span className="text-gray-soft mt-0.5 block text-[9px] font-normal tracking-[0.2em] sm:text-[10px]">
                  CONSTRUCTION COMPANY · TANZANIA
                </span>
              </div>
            </div>
            <p className="text-gray-soft mb-5 max-w-full text-sm leading-[1.6] sm:mb-7 sm:max-w-75 sm:leading-[1.7]">
              Tanzania's fast-growing multi-engineering partner. From earthworks
              to electrical, mining supplies to civil construction — we bring
              skill, safety, and proven capacity to every project we undertake.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["OSHA Certified", "BRELA Reg."].map((cert) => (
                <span
                  key={cert}
                  className="font-heading text-gray-soft border border-white/12 px-3 py-1 text-[10px] font-bold tracking-widest uppercase sm:text-[11px]"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-heading mb-4 text-sm font-black tracking-[0.2em] text-white uppercase sm:mb-6">
              Navigation
            </div>
            <ul className="list-none space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-soft wrap-break-words flex items-center gap-2 text-sm no-underline transition-colors hover:text-white"
                  >
                    <span className="text-red">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="font-heading mb-4 text-sm font-black tracking-[0.2em] text-white uppercase sm:mb-6">
              Services
            </div>
            <ul className="list-none space-y-2 sm:space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-gray-soft wrap-break-words flex items-center gap-2 text-sm no-underline transition-colors hover:text-white"
                  >
                    <span className="text-red">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-heading mb-4 text-sm font-black tracking-[0.2em] text-white uppercase sm:mb-6">
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
                  content: "info@sayukhaconstruction.co.tz",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap gap-3 sm:flex-nowrap"
                >
                  <span className="mt-0.5 shrink-0 text-lg">{item.icon}</span>
                  <div className="min-w-0">
                    <strong className="mb-0.5 block text-sm font-medium text-white">
                      {item.label}
                    </strong>
                    <span className="text-gray-soft wrap-break-words text-sm leading-[1.6] whitespace-pre-line">
                      {item.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col flex-wrap items-center justify-between gap-3 py-6 sm:flex-row sm:gap-4">
          <p className="text-center text-xs tracking-[0.08em] text-white/30 sm:text-left">
            © {new Date().getFullYear()} Sayukha Construction Ltd. All rights
            reserved. | Registered in Tanzania | BRELA No. 157957341
          </p>
          {/* <div className="flex justify-center gap-2 sm:justify-start sm:gap-3">
            {[
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Facebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-gray-soft hover:bg-green clip-logo flex h-9 w-9 items-center justify-center bg-white/5 no-underline transition-all hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
