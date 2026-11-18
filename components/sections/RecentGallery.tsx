'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface RecentGalleryProps {
  images?: string[];
  alts?: string[];
}

const RecentGallery: React.FC<RecentGalleryProps> = ({ images, alts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use provided images or fallback to default
  const defaultImages = [
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a42a457118?w=600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80',
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  // Picture number i (repeats if the package has fewer than 5 pictures)
  const getImg = (index: number) => displayImages[index % displayImages.length];
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

  // Grid positions: picture 0 is the big one on the left, pictures 1 to 4 fill a 2 x 2 block on the right
  const cells = [
    'row-span-2',
    '',
    '',
    '',
    '',
  ];

  return (
    <section className="w-full">
      {/* Same layout on every screen size: it simply scales down on phones */}
      <div className="px-4">
        <div
          className="relative mx-auto w-full max-w-[1050px] overflow-hidden rounded-xl md:rounded-2xl"
          style={{ aspectRatio: '1050 / 328' }}
        >
          <div className="grid h-full w-full grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-[3px] md:gap-[6px]">
            {cells.map((cellClass, i) => (
              <div
                key={i}
                className={`relative overflow-hidden bg-gray-100 cursor-pointer ${cellClass}`}
                onClick={() => setIsOpen(true)}
              >
                <Image
                  src={getImg(i)}
                  alt={getAlt(i)}
                  fill
                  sizes={i === 0 ? '(min-width: 1050px) 525px, 50vw' : '(min-width: 1050px) 256px, 25vw'}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* View all images button, on the top right picture */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="absolute top-2 right-2 md:top-3 md:right-3 z-10 flex items-center gap-1.5 rounded-md bg-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold text-gray-800 shadow hover:bg-gray-100 transition-colors"
          >
            <svg className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            View all images
          </button>
        </div>
      </div>

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
