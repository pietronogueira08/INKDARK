'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              PORTFOLIO SECTION — ASYMMETRIC MASONRY GALLERY             ║
 * ║                  Premium Dark Mode with Framer Motion                    ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  HOW TO SWAP IN YOUR OWN IMAGES:                                         ║
 * ║  1. Place your images in /public/portfolio/                              ║
 * ║  2. Update the PORTFOLIO_ITEMS array below — set `src`, `title`,        ║
 * ║     `style`, `artist`, and `span` for each item.                        ║
 * ║  3. `span` controls the asymmetric layout:                               ║
 * ║       - 'tall'  → 2-row height card (portrait emphasis)                 ║
 * ║       - 'wide'  → 2-column width card (landscape emphasis)              ║
 * ║       - 'normal'→ standard 1×1 card                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardSpan = 'tall' | 'wide' | 'normal';

interface PortfolioItem {
  id: string;
  src: string;
  title: string;
  style: string;
  artist: string;
  span: CardSpan;
}

// ─── Data — swap in your own assets here ──────────────────────────────────────

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    src: '/portfolio/micro-realism-eye.png',
    title: 'Teardrops',
    style: 'Micro Realism',
    artist: 'Dante Morretti',
    span: 'tall',
  },
  {
    id: 'p2',
    src: '/portfolio/blackwork-mandala.png',
    title: 'Sacred Geometry',
    style: 'Blackwork',
    artist: 'Aria Chen',
    span: 'normal',
  },
  {
    id: 'p3',
    src: '/portfolio/japanese-sleeve.png',
    title: 'Koi & Waves',
    style: 'Japanese Irezumi',
    artist: 'Riku Tanaka',
    span: 'wide',
  },
  {
    id: 'p4',
    src: '/portfolio/portrait-realism.png',
    title: 'Eternal Gaze',
    style: 'Portrait Realism',
    artist: 'Dante Morretti',
    span: 'normal',
  },
  {
    id: 'p5',
    src: '/portfolio/fine-line-botanical.png',
    title: 'Bloom',
    style: 'Fine Line',
    artist: 'Sofia Laurent',
    span: 'tall',
  },
  {
    id: 'p6',
    src: '/portfolio/neo-traditional-wolf.png',
    title: 'Alpha',
    style: 'Neo-Traditional',
    artist: 'Riku Tanaka',
    span: 'normal',
  },
  {
    id: 'p7',
    src: '/portfolio/micro-minimalist.png',
    title: 'Celestial',
    style: 'Micro Minimalist',
    artist: 'Sofia Laurent',
    span: 'normal',
  },
  {
    id: 'p8',
    src: '/portfolio/dotwork-backpiece.png',
    title: 'Sacred Veil',
    style: 'Dotwork',
    artist: 'Aria Chen',
    span: 'wide',
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const overlayVariants: Variants = {
  rest: { y: '100%', opacity: 0 },
  hover: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const arrowVariants: Variants = {
  rest: { x: 0 },
  hover: {
    x: 5,
    transition: { duration: 0.3, ease: 'easeOut', repeat: Infinity, repeatType: 'mirror' },
  },
};

// ─── Span → Tailwind class mapping ────────────────────────────────────────────

const spanClasses: Record<CardSpan, string> = {
  tall: 'row-span-2',
  wide: 'col-span-2',
  normal: '',
};

const heightClasses: Record<CardSpan, string> = {
  tall: 'h-full min-h-[540px]',
  wide: 'h-80',
  normal: 'h-64',
};

// ─── Individual Card ──────────────────────────────────────────────────────────

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  return (
    <motion.article
      variants={cardVariants}
      className={`relative group overflow-hidden rounded-2xl cursor-pointer ${spanClasses[item.span]}`}
      id={`portfolio-card-${item.id}`}
      whileHover="hover"
      initial="rest"
      animate="rest"
      aria-label={`${item.title} — ${item.style} by ${item.artist}`}
    >
      {/* ── Image wrapper ──────────────────────────────────────────────────── */}
      <div className={`relative w-full overflow-hidden ${heightClasses[item.span]}`}>

        {/* Base dark overlay — always present at low opacity */}
        <div className="absolute inset-0 z-10 bg-black/20 transition-opacity duration-500 group-hover:bg-black/5" />

        {/* The actual image */}
        <motion.div
          className="absolute inset-0"
          variants={{
            rest: { scale: 1 },
            hover: {
              scale: 1.06,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <Image
            src={item.src}
            alt={`${item.title} — ${item.style} tattoo`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
            priority={index < 4}
          />
        </motion.div>

        {/* ── Style chip — top right corner ──────────────────────────────── */}
        <motion.div
          className="absolute top-4 right-4 z-20"
          variants={{
            rest: { opacity: 1, y: 0 },
            hover: { opacity: 0, y: -8, transition: { duration: 0.25 } },
          }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase text-white/60 border border-white/10 bg-black/40 backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {item.style}
          </span>
        </motion.div>

        {/* ── Glass overlay — slides up from bottom on hover ──────────────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-b-2xl"
          variants={overlayVariants}
        >
          {/* Glass background */}
          <div className="backdrop-blur-md bg-black/50 border-t border-white/10 px-6 py-5">

            {/* Style tag */}
            <p
              className="text-yellow-500/80 text-xs tracking-[0.4em] uppercase mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {item.style}
            </p>

            {/* Title */}
            <h3
              className="text-white text-2xl leading-none mb-1"
              style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
            >
              {item.title}
            </h3>

            {/* Artist */}
            <p
              className="text-white/40 text-xs mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              by {item.artist}
            </p>

            {/* View Details CTA */}
            <div className="flex items-center gap-2 group/link">
              <span
                className="text-white/70 text-xs tracking-widest uppercase group-hover/link:text-white transition-colors duration-300"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                View Details
              </span>
              <motion.span
                className="text-yellow-500 text-sm"
                variants={arrowVariants}
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* ── Corner accent mark ─────────────────────────────────────────── */}
        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-5 h-5 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-yellow-500/60" />
            <div className="absolute top-0 left-0 w-px h-full bg-yellow-500/60" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-5 h-5 relative">
            <div className="absolute bottom-0 right-0 w-full h-px bg-yellow-500/60" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-yellow-500/60" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-zinc-950 py-24 md:py-36 overflow-hidden"
      aria-label="Tattoo Portfolio Gallery"
    >
      {/* ── Background texture elements ───────────────────────────────────── */}
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Radial glow — top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left — title block */}
          <div className="flex flex-col gap-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-yellow-600/80 to-transparent" />
              <span
                className="text-yellow-500/60 text-xs tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Our Work
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-white leading-none"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                letterSpacing: '-0.01em',
              }}
            >
              THE{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #c9a84c 0%, #f5d98b 50%, #a07830 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CANVAS
              </span>
              <br />
              IS SKIN.
            </h2>
          </div>

          {/* Right — description + CTA */}
          <div className="flex flex-col gap-6 max-w-sm">
            <p
              className="text-white/40 text-sm leading-relaxed font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Each piece is a collaboration — your story, our craft. Browse our curated collection of original works spanning every discipline of fine tattooing.
            </p>

            <a
              href="#contact"
              id="portfolio-cta-commission"
              className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-300 pointer-events-auto"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span>Commission Your Piece</span>
              <span className="w-8 h-px bg-white/30 group-hover:w-14 group-hover:bg-yellow-500/70 transition-all duration-500" />
            </a>
          </div>
        </motion.div>

        {/* ── Masonry Grid ────────────────────────────────────────────────── */}
        <motion.div
          ref={gridRef}
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            lg:grid-cols-4
            auto-rows-[260px]
            gap-4
            md:gap-5
          "
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
        >
          {PORTFOLIO_ITEMS.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>

        {/* ── Bottom CTA strip ─────────────────────────────────────────────── */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Divider line with diamond */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-white/8" />
            <div className="w-1.5 h-1.5 rotate-45 bg-yellow-600/60" />
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p
            className="text-white/25 text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            200+ Original Works — Each Piece Unique
          </p>

          <a
            href="#portfolio-full"
            id="portfolio-view-all"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full border border-white/10 hover:border-yellow-600/40 text-white/60 hover:text-white text-sm tracking-widest uppercase transition-all duration-400 pointer-events-auto overflow-hidden"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {/* Hover background fill */}
            <span className="absolute inset-0 bg-yellow-600/0 group-hover:bg-yellow-600/5 transition-colors duration-500" />
            <span className="relative">View Full Portfolio</span>
            <span className="relative text-yellow-600/60 group-hover:text-yellow-500 transition-colors duration-300">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
