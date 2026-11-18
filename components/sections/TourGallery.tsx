'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface RecentGalleryProps {
  images?: string[];
  alts?: string[];
}

// Where each picture sits inside the gallery (percentages of the gallery's width and height).
// Order: 0 = left, 1 and 2 = stacked, 3 = big middle, 4 and 5 = stacked, 6 = right.
const tiles = [
  { left: 0, top: 26.45, width: 16.88, height: 45.34, big: false },
  { left: 18.29, top: 5.04, width: 18.48, height: 42.07, big: false },
  { left: 18.29, top: 49.87, width: 18.48, height: 42.07, big: false },
  { left: 38.18, top: 0, width: 23.64, height: 100, big: true },
  { left: 63.23, top: 5.04, width: 18.48, height: 42.07, big: false },
  { left: 63.23, top: 49.87, width: 18.48, height: 42.07, big: false },
  { left: 83.12, top: 26.45, width: 16.88, height: 45.34, big: false },
];

// Corner roundness grows and shrinks with the gallery so it looks the same on every screen
const smallRadius = 'calc(min(100vw, 1066px) * 0.0225)';
const bigRadius = 'calc(min(100vw, 1066px) * 0.045)';

const RecentGallery: React.FC<RecentGalleryProps> = ({ images, alts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use provided images or fallback to default
  const defaultImages = [
    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1544551763-46a42a457118?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=900&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=400&q=80',
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  // Helper to safely get image URL (repeats if not enough images)
  const getImg = (index: number) => displayImages[index % displayImages.length];
  // Helper to get alt text with fallback
  const getAlt = (index: number) => alts[index % displayImages.length] || `Gallery image ${index + 1}`;

  // Close the popup with the Escape key and stop the page behind it from scrolling
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <section className="w-full py-8 md:py-12">
      <h2 className="text-3xl md:text-[40px] font-bold text-center text-[#183B56] mb-8 md:mb-12 font-serif">
        Recent Gallery
      </h2>

      {/* Same layout on every screen size: it simply scales down on phones */}
      <div className="px-4">
        <div className="relative mx-auto w-full max-w-[1066px]" style={{ aspectRatio: '1066 / 397' }}>
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`absolute overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 ${
                tile.big ? 'shadow-xl' : 'shadow-lg'
              }`}
              style={{
                left: `${tile.left}%`,
                top: `${tile.top}%`,
                width: `${tile.width}%`,
                height: `${tile.height}%`,
                borderRadius: tile.big ? bigRadius : smallRadius,
                zIndex: tile.big ? 10 : 1,
              }}
            >
              <Image
                src={getImg(i)}
                alt={getAlt(i)}
                fill
                sizes={tile.big ? '(min-width: 1066px) 252px, 24vw' : '(min-width: 1066px) 197px, 19vw'}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Only shown when the package has more pictures than the layout can hold */}
      {displayImages.length > tiles.length && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 rounded-lg border border-[#183B56] text-[#183B56] text-sm font-semibold hover:bg-[#183B56] hover:text-white transition-colors"
          >
            View all {displayImages.length} photos
          </button>
        </div>
      )}

      {/* All images popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto" onClick={() => setIsOpen(false)}>
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white text-gray-800 text-xl leading-none flex items-center justify-center shadow"
          >
            ✕
          </button>
          <div
            className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={img}
                  alt={alts[idx] || `Gallery image ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentGallery;
