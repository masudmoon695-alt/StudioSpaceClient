import { HomeSections } from "@/components/home/home-sections";
import { HeroSlider } from "@/components/home/hero-slider";

export default function HomePage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="container-page pt-10 md:pt-14">
        <HeroSlider />
      </section>
      <HomeSections />
    </main>
  );
}
