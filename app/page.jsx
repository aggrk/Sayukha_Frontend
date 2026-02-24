import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { About } from "../components/sections/About";
import { CallToAction } from "../components/sections/CallToAction";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/Projects";
import { Services } from "../components/sections/Services";
import { Stats } from "../components/sections/Stats";
import { Testimonials } from "../components/sections/Testimonials";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Projects />
      <Stats />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
