// components/Gallery.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ChevronDown, Play } from "lucide-react";
import FadeInSection from "./FadeInSection";
import { galleryItems, type GalleryItem } from "./galleryItems";

/** How many tiles to show before the user expands the gallery. */
const INITIAL_COUNT = 9;

export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Build the filter buttons from the data, in order of first appearance.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const item of galleryItems) {
      if (!seen.includes(item.category)) seen.push(item.category);
    }
    return ["All", ...seen];
  }, []);

  const filtered = useMemo(
    () =>
      category === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.category === category),
    [category]
  );

  const shown = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hiddenCount = filtered.length - shown.length;

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  // Keyboard controls for the lightbox, and lock background scrolling.
  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  function changeCategory(next: string) {
    setCategory(next);
    setExpanded(false);
    setOpenIndex(null);
  }

  function toggleExpanded() {
    if (expanded) {
      setExpanded(false);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setExpanded(true);
    }
  }

  const active = openIndex === null ? null : filtered[openIndex];

  return (
    <FadeInSection id="gallery" className="mx-auto max-w-5xl px-5 py-24">
      <div ref={topRef} className="scroll-mt-24">
        <h2 className="mb-4 text-center text-3xl font-semibold text-brand-cyan">
          Gallery
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center leading-relaxed text-gray-300">
          Scholarship opportunities, study destinations, and guidance from our
          counselling team.
        </p>
      </div>

      {/* Category filters */}
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((name) => {
            const isActive = category === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => changeCategory(name)}
                aria-pressed={isActive}
                className={`rounded-lg border px-5 py-2 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                  isActive
                    ? "border-white/40 bg-white/25 text-white"
                    : "border-transparent bg-white/10 text-gray-200 hover:bg-white/20"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-300">
          Nothing here yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {shown.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group flex transform flex-col overflow-hidden rounded-lg bg-white/10 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transform-none"
            >
              <span className="relative block aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={thumbnailOf(item)}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className={`transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none ${
                    item.fit === "cover" ? "object-cover" : "object-contain"
                  }`}
                />
                {item.kind === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-12 w-12 text-white drop-shadow-lg" />
                  </span>
                )}
              </span>
              {item.caption && (
                <span className="block px-4 py-3 text-sm leading-relaxed text-gray-300">
                  {item.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Expand / collapse */}
      {filtered.length > INITIAL_COUNT && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded}
            aria-controls="gallery"
            className="flex items-center gap-2 rounded-lg border border-transparent bg-white/10 px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transform-none"
          >
            {expanded ? "Show less" : `Show ${hiddenCount} more`}
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X className="h-6 w-6" />
          </button>

          {filtered.length > 1 && (
            <>
              <span className="absolute left-1/2 top-6 -translate-x-1/2 text-sm text-gray-300">
                {(openIndex ?? 0) + 1} / {filtered.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous item"
                className="absolute left-2 rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:left-6"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next item"
                className="absolute right-2 rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-6"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
          >
            {active.kind === "image" && active.src && (
              <div className="relative h-[70vh] w-full">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-contain"
                />
              </div>
            )}

            {active.kind === "video" && (
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-black/60">
                {active.youtubeId ? (
                  <iframe
                    key={active.id}
                    src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                    title={active.alt}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  active.src && (
                    <video
                      key={active.id}
                      src={active.src}
                      poster={active.thumb}
                      controls
                      autoPlay
                      playsInline
                      className="h-full w-full"
                    />
                  )
                )}
              </div>
            )}

            {active.caption && (
              <figcaption className="text-center leading-relaxed text-gray-300">
                {active.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </FadeInSection>
  );
}

function thumbnailOf(item: GalleryItem): string {
  return item.thumb ?? item.src ?? "/gallery/placeholder.png";
}
