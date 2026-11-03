"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperModule } from "swiper/types";
import { ArrowRight } from "lucide-react";
import "swiper/css";

import { ButtonLink } from "@/components/button-link";

interface HeroSlideData {
  id: string;
  /** Gel wash used for the cone of light over the image. */
  gel: string;
  headline: string;
  sub: string;
  image: string;
  imageAlt: string;
}

const SLIDES: readonly HeroSlideData[] = [
  {
    id: "magenta",
    gel: "#D81E6B",
    headline: "Find the room your next shoot needs.",
    sub: "Book cyc walls, sound stages and podcast rooms by the hour, with the price shown before you commit.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80",
    imageAlt: "Film stage with cyc wall and camera equipment",
  },
  {
    id: "daylight",
    gel: "#2D6BFF",
    headline: "Record in a room that sounds right.",
    sub: "Treated music suites and podcast lounges with the gear already on the stands.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80",
    imageAlt: "Music suite with microphone stands",
  },
  {
    id: "tungsten",
    gel: "#F2A33A",
    headline: "Your empty studio is booked time waiting to happen.",
    sub: "List your space, set your rate, and approve requests when it suits you.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    imageAlt: "Art workshop room with easel and light",
  },
];

const modules: SwiperModule[] = [];

const washFor = (gel: string): string =>
  `radial-gradient(ellipse 70% 55% at 74% 112%, color-mix(in oklab, ${gel} 45%, transparent), transparent 70%)`;

export function HeroSlider() {
  return (
    <div className="w-full lg:aspect-[21/10]">
      <Swiper modules={modules} slidesPerView={1} className="min-h-[700px] w-full sm:min-h-[740px] lg:h-full lg:min-h-0">
        {SLIDES.map((slide, index) => (
          <SwiperSlide
            key={slide.id}
            className="h-full w-full"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}`}
          >
            <div
              className="relative min-h-[700px] w-full overflow-hidden rounded-card border border-border bg-card sm:min-h-[740px] lg:h-full lg:min-h-0"
              style={{ borderBottomLeftRadius: "clamp(40px, 16vw, 220px)" }}
            >
              <div className="relative z-10 grid min-h-[700px] w-full grid-cols-1 gap-7 p-6 sm:min-h-[740px] sm:p-10 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 lg:p-14">
                <div className="max-w-2xl">
                  <h1 className="animate-hero-settle text-h1 text-balance">
                    {slide.headline}
                  </h1>
                  <p className="measure mt-5 text-lede">{slide.sub}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="/studios" size="lg">
                      Explore Studios
                      <ArrowRight aria-hidden />
                    </ButtonLink>
                    <ButtonLink href="/studios" size="lg" variant="outline">
                      Host Your Space
                    </ButtonLink>
                  </div>
                </div>

                <div className="relative order-2 aspect-[16/10] w-full overflow-hidden rounded-bl-[72px] lg:order-none lg:rounded-bl-[200px]">
                  <div
                    className="animate-hero-sweep absolute inset-0 overflow-hidden"
                    style={{ backgroundImage: washFor(slide.gel) }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
