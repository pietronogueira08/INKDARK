'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║               AUTHORITY SECTION — CANVAS SCROLL SCRUBBING               ║
 * ║                   Apple-Style Image Sequence Animation                   ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  HOW TO SET UP YOUR IMAGE FRAMES:                                        ║
 * ║                                                                          ║
 * ║  1. Place all your exported video frames in:                             ║
 * ║     /public/ink-machine/                                                 ║
 * ║                                                                          ║
 * ║  2. Name them with zero-padded numbers starting at 001:                 ║
 * ║     ezgif-frame-001.jpg                                                  ║
 * ║     ezgif-frame-002.jpg                                                  ║
 * ║     ...                                                                  ║
 * ║     ezgif-frame-192.jpg                                                  ║
 * ║                                                                          ║
 * ║  3. Update TOTAL_FRAMES below if your sequence has a different count.   ║
 * ║                                                                          ║
 * ║  4. Format: JPG recommended for fast network decode.                    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Total number of image frames in the sequence */
const TOTAL_FRAMES = 192;

/** Base path to the frames inside /public */
const FRAMES_BASE_PATH = '/ink-machine';

/** File naming pattern — matches ezgif-frame-001.jpg, ezgif-frame-192.jpg, etc. */
const getFrameUrl = (index: number): string => {
  const padded = String(index).padStart(3, '0');
  return `${FRAMES_BASE_PATH}/ezgif-frame-${padded}.jpg`;
};

// ─── Text Pillars ─────────────────────────────────────────────────────────────

interface TextPillar {
  id: string;
  eyebrow: string;
  headline: string;
  subline: string;
  /** scrollYProgress ranges for opacity: [in-start, in-end, out-start, out-end] */
  opacityRange: [number, number, number, number];
  /** scrollYProgress ranges for y-translate: subtle parallax */
  yRange: [number, number, number, number];
}

const TEXT_PILLARS: TextPillar[] = [
  {
    id: 'pillar-precision',
    eyebrow: '01 — Technique',
    headline: 'Surgical\nPrecision.',
    subline:
      'Every line is a deliberate decision. Our artists operate with micron-level accuracy, translating your vision into permanent, flawless strokes.',
    opacityRange: [0, 0.1, 0.25, 0.35],
    yRange: [0, 0, 0, 0],
  },
  {
    id: 'pillar-ink',
    eyebrow: '02 — Materials',
    headline: '100% Original\nInk.',
    subline:
      'We source only medical-grade, vegan-certified pigments. Colors that stay vivid for decades — because permanence demands the best.',
    opacityRange: [0.35, 0.45, 0.6, 0.7],
    yRange: [0, 0, 0, 0],
  },
  {
    id: 'pillar-experience',
    eyebrow: '03 — Environment',
    headline: 'Immersive\nExperience.',
    subline:
      'Step into a sanctuary built for focus and comfort. From the first consultation to the final reveal, every detail is curated for you.',
    opacityRange: [0.7, 0.8, 0.95, 1],
    yRange: [0, 0, 0, 0],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AnimatedTextPillarProps {
  pillar: TextPillar;
  scrollYProgress: MotionValue<number>;
}

function AnimatedTextPillar({ pillar, scrollYProgress }: AnimatedTextPillarProps) {
  const opacity = useTransform(
    scrollYProgress,
    pillar.opacityRange,
    [0, 1, 1, 0]
  );

  // Reduced y-translation on mobile (16px) vs desktop (24px) to prevent
  // jarring off-screen movements on small viewports
  const y = useTransform(
    scrollYProgress,
    pillar.opacityRange,
    [16, 0, 0, -16]
  );

  return (
    <motion.div
      id={pillar.id}
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y }}
      aria-label={pillar.headline.replace('\n', ' ')}
    >
      {/* Centered content column — tighter padding on mobile */}
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-4 md:gap-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-yellow-600/80" />
          <span
            className="text-yellow-500/70 text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {pillar.eyebrow}
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-yellow-600/80" />
        </div>

        {/* Headline — mobile-safe clamp starting at 2.5rem */}
        <h2
          className="text-white leading-none whitespace-pre-line"
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
            letterSpacing: '-0.01em',
            textShadow: '0 0 80px rgba(0,0,0,0.9)',
          }}
        >
          {pillar.headline}
        </h2>

        {/* Divider */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-600/60 to-transparent" />

        {/* Body — smaller on mobile */}
        <p
          className="text-white/50 text-sm md:text-base lg:text-lg leading-relaxed max-w-xs md:max-w-md font-light px-2 md:px-0"
          style={{
            fontFamily: 'var(--font-inter)',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
        >
          {pillar.subline}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Loading Progress Bar ─────────────────────────────────────────────────────

interface LoadingOverlayProps {
  progress: number; // 0–100
}

function LoadingOverlay({ progress }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
      <div className="flex flex-col items-center gap-4">
        <span
          className="text-white/20 text-xs tracking-[0.5em] uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Preparing Frames
        </span>
        <div className="w-48 h-px bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className="text-white/15 text-xs tabular-nums"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthoritySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const loadedCountRef = useRef(0);
  const loadingProgressRef = useRef(0);
  const isFullyLoadedRef = useRef(false);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const currentFrameRef = useRef(0);

  // Framer Motion scroll tracking scoped to our tall container
  const { scrollYProgress } = useScroll({ target: containerRef });

  // ── Canvas resize handler ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-draw the current frame after resize
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ── Image preloader ────────────────────────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let loaded = 0;

    const updateLoadingUI = (pct: number) => {
      loadingProgressRef.current = pct;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(pct)}%`;
      }
      // Hide overlay once fully loaded
      if (pct >= 100 && loadingOverlayRef.current) {
        loadingOverlayRef.current.style.transition = 'opacity 0.6s ease';
        loadingOverlayRef.current.style.opacity = '0';
        setTimeout(() => {
          if (loadingOverlayRef.current) {
            loadingOverlayRef.current.style.display = 'none';
          }
          isFullyLoadedRef.current = true;
          // Draw first frame
          drawFrame(0);
        }, 700);
      }
    };

    // Preload all frames — parallel batch loading
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loaded++;
        loadedCountRef.current = loaded;
        updateLoadingUI((loaded / TOTAL_FRAMES) * 100);
      };
      img.onerror = () => {
        // Count errored images too so the loader doesn't stall
        loaded++;
        loadedCountRef.current = loaded;
        updateLoadingUI((loaded / TOTAL_FRAMES) * 100);
      };
      images[i - 1] = img; // 0-indexed array
    }

    return () => {
      // Cancel any pending rAF on unmount
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Canvas draw function (imperative — no React state) ────────────────────
  function drawFrame(frameIndex: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // ── Cover-fit the image to the canvas (like CSS object-fit: cover) ──────
    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const scale = Math.max(cW / iW, cH / iH);
    const drawW = iW * scale;
    const drawH = iH * scale;
    const offsetX = (cW - drawW) / 2;
    const offsetY = (cH - drawH) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // ── Subtle vignette overlay ──────────────────────────────────────────────
    const gradient = ctx.createRadialGradient(
      cW / 2, cH / 2, cH * 0.2,
      cW / 2, cH / 2, cH * 0.85
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cW, cH);
  }

  // ── Scroll → frame scrubbing via rAF ─────────────────────────────────────
  useEffect(() => {
    let lastProgress = -1;

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (!isFullyLoadedRef.current) return;
      if (Math.abs(progress - lastProgress) < 0.001) return; // debounce micro-movements
      lastProgress = progress;

      // Map 0–1 progress to 0–(TOTAL_FRAMES-1) frame index
      const rawIndex = Math.round(progress * (TOTAL_FRAMES - 1));
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, rawIndex));
      currentFrameRef.current = clampedIndex;

      // Cancel any pending rAF and schedule a new one
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(clampedIndex);
      });
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    /**
     * Outer container: `h-[400vh]` gives the massive scroll distance
     * that maps to the image sequence. Increase to slow down scrubbing.
     */
    <section
      ref={containerRef}
      className="relative h-[400vh] w-full bg-black"
      id="authority-section"
      aria-label="Studio Authority Showcase"
    >
      {/**
       * Sticky viewport: stays fixed in view as the user scrolls through
       * the tall container above. This is the "frame" of our cinema.
       */}
      {/* Sticky viewport: touch-action pan-y keeps native scroll working on iOS */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ touchAction: 'pan-y' }}
      >

        {/* ── Canvas — Layer 0 — Full-bleed image sequence ────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />

        {/* ── Loading Overlay — Imperative DOM refs for perf ───────────── */}
        <div
          ref={loadingOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black"
          style={{ zIndex: 20 }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated logo ring */}
            <div className="relative w-12 h-12 mb-2">
              <div
                className="absolute inset-0 rounded-full border border-yellow-600/30"
                style={{ animation: 'spin 2s linear infinite' }}
              />
              <div
                className="absolute inset-2 rounded-full border border-yellow-500/50"
                style={{ animation: 'spin 1.4s linear infinite reverse' }}
              />
              <div className="absolute inset-4 rounded-full bg-yellow-600/40" />
            </div>

            <span
              className="text-white/20 text-xs tracking-[0.5em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Preparing Sequence
            </span>

            <div className="w-48 h-px bg-white/10 overflow-hidden rounded-full">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 rounded-full"
                style={{ width: '0%', transition: 'width 80ms linear' }}
              />
            </div>

            <span
              ref={progressTextRef}
              className="text-white/15 text-xs tabular-nums"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              0%
            </span>
          </div>
        </div>

        {/* ── Section label — top left corner ─────────────────────────── */}
        <div
          className="absolute top-8 left-8 flex items-center gap-3 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div className="w-4 h-px bg-yellow-600/60" />
          <span
            className="text-white/25 text-xs tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            The INKDARK Standard
          </span>
        </div>

        {/* ── Scroll progress indicator — bottom center ────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
          style={{ zIndex: 10 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          <span
            className="text-white/20 text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Scroll
          </span>
        </motion.div>

        {/* ── Cinematic text overlays — Layer 10 ───────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {TEXT_PILLARS.map((pillar) => (
            <AnimatedTextPillar
              key={pillar.id}
              pillar={pillar}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* ── Bottom frame gradient ─────────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          }}
        />

        {/* ── Top frame gradient ────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* CSS for loading spinner — scoped via style tag */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
