"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";

export function StudioGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [thumbnailSwiper, setThumbnailSwiper] = useState<SwiperClass | null>(
    null,
  );
  const galleryImages = images.length ? images : [""];

  return (
    <div>
      <Swiper
        modules={[Thumbs]}
        thumbs={{
          swiper:
            thumbnailSwiper && !thumbnailSwiper.destroyed
              ? thumbnailSwiper
              : null,
        }}
        className="aspect-[4/3] overflow-hidden rounded-card border border-border bg-muted"
      >
        {galleryImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            {image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image}
                alt={`${title}, studio view ${index + 1}`}
                className="size-full object-cover"
              />
            ) : (
              <div
                role="img"
                aria-label={`${title} has no gallery image`}
                className="grid size-full place-items-center text-sm text-muted-foreground"
              >
                Studio photo unavailable
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {galleryImages.length > 1 ? (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbnailSwiper}
          spaceBetween={12}
          slidesPerView={3}
          breakpoints={{
            480: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
          }}
          watchSlidesProgress
          className="mt-3"
          aria-label="Studio photo thumbnails"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`} className="cursor-pointer">
              <button
                type="button"
                aria-label={`Show studio photo ${index + 1}`}
                className="block aspect-[4/3] w-full overflow-hidden rounded-control border border-border focus-visible:outline"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
}
