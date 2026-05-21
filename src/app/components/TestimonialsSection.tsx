'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          TESTIMONIALS SECTION — BENTO BOX SOCIAL PROOF LAYOUT           ║
 * ║                Ultra-Premium Dark Mode · Framer Motion                   ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  CUSTOMIZATION GUIDE:                                                    ║
 * ║  • Edit TESTIMONIALS array to swap quotes, names, focus areas.          ║
 * ║  • Place healed tattoo images in /public/testimonials/                  ║
 * ║  • Place client avatars in /public/testimonials/                        ║
 * ║  • All images are referenced by the `imageSrc` / `avatarSrc` fields.   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  Variants,
} from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  name: string;
  handle: string;           // e.g. "@username" or city
  quote: string;
  focus: string;            // e.g. "Healing Process", "Custom Design"
  rating: number;           // 1–5
  avatarSrc?: string;       // path in /public
  imageSrc?: string;        // healed tattoo photo path in /public
  accentColor?: string;     // optional Tailwind color class for accent line
}

// ─── Data — Edit to swap in your own content ──────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Isabella Monteiro',
    handle: '@isa.ink · São Paulo',
    quote:
      '"I\'ve been to studios across three countries. Nothing compares. Dante doesn\'t just tattoo — he sculpts light and shadow onto skin. Six months healed and it still looks fresh off the machine."',
    focus: 'Micro Realism',
    rating: 5,
    avatarSrc: '/testimonials/avatar-female-1.png',
    imageSrc: '/testimonials/healed-sleeve.png',
    accentColor: 'from-yellow-600/40 to-transparent',
  },
  {
    id: 't2',
    name: 'Lucas Ferreira',
    handle: '@lferreira · Rio de Janeiro',
    quote:
      '"The sterile environment put me at ease immediately. Everything sealed, gloved, pristine. I felt like I was in a surgical suite, not a studio."',
    focus: 'Hygiene & Safety',
    rating: 5,
    avatarSrc: '/testimonials/avatar-male-1.png',
    accentColor: 'from-white/20 to-transparent',
  },
  {
    id: 't3',
    name: 'Valentina Cruz',
    handle: '@val.dotwork · Buenos Aires',
    quote:
      '"Aria spent three sessions just on the design. No rushing. She understood the geometry I wanted better than I could articulate it myself. The result is beyond anything I imagined."',
    focus: 'Custom Design Process',
    rating: 5,
    imageSrc: '/testimonials/healed-backpiece.png',
    accentColor: 'from-yellow-700/30 to-transparent',
  },
  {
    id: 't4',
    name: 'Mateus Oliveira',
    handle: '@mateus.art · Curitiba',
    quote:
      '"Two years healed. Still black as the day it was done. That\'s craftsmanship."',
    focus: 'Longevity & Ink Quality',
    rating: 5,
    accentColor: 'from-white/15 to-transparent',
  },
  {
    id: 't5',
    name: 'Sofia Andrade',
    handle: '@sofiaink · Lisboa',
    quote:
      '"The aftercare protocol they provided was meticulous. Healing was faster and smoother than any of my previous tattoos. INKDARK is in a different league."',
    focus: 'Healing & Aftercare',
    rating: 5,
    imageSrc: '/testimonials/healed-wrist.png',
    accentColor: 'from-yellow-600/25 to-transparent',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Renders N minimalist star icons */
function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 1L7.39 4.26L11 4.73L8.5 7.14L9.18 10.73L6 9L2.82 10.73L3.5 7.14L1 4.73L4.61 4.26L6 1Z"
            fill={i < count ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.12)'}
            stroke={i < count ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

/** Focus badge pill */
function FocusBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs tracking-widest uppercase text-white/40 border border-white/8 bg-white/4"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {label}
    </span>
  );
}

/** Client identity row */
function ClientIdentity({
  name,
  handle,
  avatarSrc,
}: {
  name: string;
  handle: string;
  avatarSrc?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
        {avatarSrc ? (
          <Image src={avatarSrc} alt={name} fill className="object-cover" />
        ) : (
          /* Fallback monogram */
          <span
            className="absolute inset-0 flex items-center justify-center text-white/50 text-sm font-medium"
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            {name[0]}
          </span>
        )}
      </div>
      {/* Name + handle */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-white/80 text-sm font-medium truncate"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {name}
        </span>
        <span
          className="text-white/30 text-xs truncate"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {handle}
        </span>
      </div>
    </div>
  );
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 52, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Bento Card Components ─────────────────────────────────────────────────────

// Card A — Hero image card with quote overlay (spans 2 cols)
function CardHeroImage({ item }: { item: Testimonial }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative md:col-span-2 rounded-3xl overflow-hidden min-h-[320px] group cursor-default"
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Full-bleed background image */}
      {item.imageSrc && (
        <Image
          src={item.imageSrc}
          alt={`Healed tattoo — ${item.focus}`}
          fill
          className="object-cover transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105"
        />
      )}

      {/* Gradient overlay — bottom heavy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Gold accent top-left line */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${item.accentColor}`}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <FocusBadge label={item.focus} />
          <StarRating count={item.rating} />
        </div>

        {/* Quote + client */}
        <div className="flex flex-col gap-5">
          <blockquote>
            <p
              className="text-white/90 text-lg md:text-xl leading-snug font-light max-w-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {item.quote}
            </p>
          </blockquote>
          <ClientIdentity
            name={item.name}
            handle={item.handle}
            avatarSrc={item.avatarSrc}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Card B — Pure glassmorphism text card (1 col)
function CardText({ item }: { item: Testimonial }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 flex flex-col justify-between gap-6 min-h-[240px] group hover:bg-white/8 hover:border-white/16 transition-all duration-500 cursor-default overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle inner glow on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Accent top line */}
      <div
        className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${item.accentColor}`}
      />

      {/* Top: rating + focus */}
      <div className="flex flex-col gap-3 relative z-10">
        <StarRating count={item.rating} />
        <FocusBadge label={item.focus} />
      </div>

      {/* Quote */}
      <blockquote className="relative z-10">
        <p
          className="text-white/70 text-sm leading-relaxed font-light"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {item.quote}
        </p>
      </blockquote>

      {/* Client */}
      <ClientIdentity
        name={item.name}
        handle={item.handle}
        avatarSrc={item.avatarSrc}
      />
    </motion.div>
  );
}

// Card C — Tall image card (spans 2 rows, 1 col)
function CardTallImage({ item }: { item: Testimonial }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative md:row-span-2 rounded-3xl overflow-hidden min-h-[480px] group cursor-default"
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {item.imageSrc && (
        <Image
          src={item.imageSrc}
          alt={`Healed tattoo — ${item.focus}`}
          fill
          className="object-cover transition-all duration-700 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105"
        />
      )}

      {/* Gradient — stronger on bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Accent line */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${item.accentColor}`}
      />

      {/* Content anchored at bottom */}
      <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <FocusBadge label={item.focus} />
          <StarRating count={item.rating} />
        </div>

        <blockquote>
          <p
            className="text-white/85 text-base leading-snug font-light"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {item.quote}
          </p>
        </blockquote>

        <ClientIdentity
          name={item.name}
          handle={item.handle}
          avatarSrc={item.avatarSrc}
        />
      </div>
    </motion.div>
  );
}

// Card D — Compact highlight card (image accent + short quote)
function CardCompact({ item }: { item: Testimonial }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-3xl border border-white/8 bg-white/4 backdrop-blur-lg overflow-hidden min-h-[220px] group hover:bg-white/8 hover:border-white/16 transition-all duration-500 cursor-default"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image strip — top 45% */}
      {item.imageSrc && (
        <div className="relative w-full h-32 overflow-hidden">
          <Image
            src={item.imageSrc}
            alt={`Healed tattoo — ${item.focus}`}
            fill
            className="object-cover transition-all duration-700 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <FocusBadge label={item.focus} />
          <StarRating count={item.rating} />
        </div>
        <p
          className="text-white/65 text-sm leading-relaxed font-light"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {item.quote}
        </p>
        <ClientIdentity
          name={item.name}
          handle={item.handle}
          avatarSrc={item.avatarSrc}
        />
      </div>

      {/* Hover inner glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

// ─── Aggregate Stats Strip ────────────────────────────────────────────────────

const STATS = [
  { value: '4.98', label: 'Average Rating', suffix: '/5' },
  { value: '600+', label: 'Reviews Published', suffix: '' },
  { value: '12', label: 'Years of Excellence', suffix: '' },
  { value: '100%', label: 'Recommend Us', suffix: '' },
];

function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 md:mb-20"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {STATS.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center text-center px-4 py-5 rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm hover:bg-white/6 hover:border-white/12 transition-all duration-400 group"
        >
          <div className="flex items-baseline gap-0.5 mb-1">
            <span
              className="text-3xl font-black text-white/90"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2rem',
                background: 'linear-gradient(135deg, #c9a84c, #f5d98b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.value}
            </span>
            {s.suffix && (
              <span
                className="text-white/30 text-sm"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {s.suffix}
              </span>
            )}
          </div>
          <span
            className="text-white/35 text-xs tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  // Destructure the 5 testimonial items for specific card placements
  const [t1, t2, t3, t4, t5] = TESTIMONIALS;

  return (
    <section
      id="testimonials"
      className="relative bg-black py-24 md:py-36 overflow-hidden"
      aria-label="Client Testimonials"
    >
      {/* ── Background ambience ───────────────────────────────────────────── */}
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Radial amber glow top-right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)',
        }}
      />

      {/* Bottom-left dark fade */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom left, rgba(201,168,76,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-yellow-600/80 to-transparent" />
              <span
                className="text-yellow-500/60 text-xs tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Social Proof
              </span>
            </div>

            <h2
              className="text-white leading-none"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                letterSpacing: '-0.01em',
              }}
            >
              WORN WITH{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #c9a84c 0%, #f5d98b 50%, #a07830 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PRIDE.
              </span>
            </h2>
          </div>

          {/* Right */}
          <p
            className="text-white/35 text-sm leading-relaxed font-light max-w-xs"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Real clients. Real skin. Real stories. Every testimonial is an unfiltered account of what it means to trust INKDARK with your most permanent decision.
          </p>
        </motion.div>

        {/* ── Aggregate Stats ─────────────────────────────────────────────── */}
        <StatsStrip />

        {/* ── Bento Grid ──────────────────────────────────────────────────── */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
        >
          {/*
           * BENTO LAYOUT MAP (3-col grid):
           *
           * [ CardHeroImage (col-span-2) ] [ CardTallImage (row-span-2) ]
           * [ CardText (col-span-1)      ] [      ↑ continues            ]
           * [ CardCompact (col-span-1)   ] [ CardText (col-span-1)       ]
           */}

          {/* Row 1, Cols 1-2: Hero image card */}
          <CardHeroImage item={t1} />

          {/* Rows 1-2, Col 3: Tall portrait card */}
          <CardTallImage item={t3} />

          {/* Row 2, Col 1: Pure text glassmorphism card */}
          <CardText item={t2} />

          {/* Row 2, Col 2: Pure text glassmorphism card */}
          <CardText item={t4} />

          {/* Row 3, full 3 cols as 3 equal cards */}
          <CardCompact item={t5} />

          {/* Inline Highlight Card — "The INKDARK Promise" — spans 2 cols */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-2 relative rounded-3xl overflow-hidden border border-yellow-600/15 bg-gradient-to-br from-yellow-950/20 via-black to-black p-8 flex flex-col justify-between gap-6 min-h-[180px] group hover:border-yellow-600/25 transition-all duration-500"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle radial shimmer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 0% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
              }}
            />

            {/* Gold top accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-yellow-600/50 via-yellow-400/30 to-transparent" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex flex-col gap-2">
                <span
                  className="text-yellow-500/60 text-xs tracking-[0.45em] uppercase"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  The INKDARK Guarantee
                </span>
                <p
                  className="text-white leading-tight"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    letterSpacing: '0.03em',
                  }}
                >
                  Not satisfied with the result?
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #c9a84c, #f5d98b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    We fix it. Free. No questions asked.
                  </span>
                </p>
              </div>

              <a
                href="#consultation"
                id="testimonials-cta-consult"
                className="pointer-events-auto flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black text-sm font-semibold tracking-widest uppercase transition-all duration-400 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] group/btn"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <span>Book Now</span>
                <span className="text-black/60 group-hover/btn:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Platform badges ───────────────────────────────────────────────── */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
        >
          <span
            className="text-white/20 text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            As seen on
          </span>

          {['Google', 'Instagram', 'Yelp', 'Tattoodo'].map((platform) => (
            <span
              key={platform}
              className="text-white/25 text-sm hover:text-white/45 transition-colors duration-300 tracking-wide cursor-default"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
            >
              {platform}
            </span>
          ))}

          {/* Divider dot */}
          <div className="hidden md:flex items-center gap-10">
            <div className="w-1 h-1 rounded-full bg-yellow-600/40" />
            <span
              className="text-white/20 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              100% Verified Reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
