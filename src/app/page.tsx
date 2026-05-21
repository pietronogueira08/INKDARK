'use client';

import { useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import AuthoritySection from './components/AuthoritySection';
import PortfolioSection from './components/PortfolioSection';
import TestimonialsSection from './components/TestimonialsSection';
import ProcessFaqSection from './components/ProcessFaqSection';
import CtaSection from './components/CtaSection';

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Artists', href: '#artists' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

const STATS: Stat[] = [
  { value: '12+', label: 'Years of Mastery' },
  { value: '3.8K', label: 'Pieces Crafted' },
  { value: '98%', label: 'Client Satisfaction' },
];

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Pulsing logo mark */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer ring */}
        <div
          className="loader-ring absolute w-20 h-20 rounded-full border border-yellow-600/40"
          style={{ animationDelay: '0s' }}
        />
        {/* Middle ring */}
        <div
          className="loader-ring absolute w-14 h-14 rounded-full border border-yellow-500/60"
          style={{ animationDelay: '0.3s' }}
        />
        {/* Inner dot */}
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700" />
      </div>

      {/* Studio name */}
      <p
        className="text-white/30 tracking-[0.4em] uppercase text-xs font-light"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Loading Experience
      </p>

      {/* Progress bar */}
      <div className="mt-6 w-40 h-px bg-white/10 overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
          style={{
            animation: 'progressBar 2s ease-in-out infinite',
            width: '60%',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HeroPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    // overflow-x-hidden prevents horizontal scroll from off-screen animations
    <main className="overflow-x-hidden w-full">
      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <>
      {/* ── Loading overlay ───────────────────────────────────────────────── */}
      {!isLoaded && <LoadingSkeleton />}

      {/* ── 3D Canvas Layer — z-index 0 ─────────────────────────────────── */}
      {/* touch-action: pan-y allows vertical swipe-scroll through the Spline on iOS */}
      <div
        className="fixed inset-0 w-screen h-screen z-0 overflow-hidden pointer-events-auto"
        style={{ touchAction: 'pan-y' }}
      >
        <Spline
          scene="https://prod.spline.design/t0YWw0cLAuiBgJKF/scene.splinecode"
          onLoad={handleSplineLoad}
          style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
        />
      </div>

      {/* ── Ambient overlays (non-interactive) ────────────────────────────── */}
      {/* Vignette */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      {/* Bottom gradient */}
      <div
        className="fixed bottom-0 left-0 right-0 h-64"
        style={{
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />

      {/* ── UI Layer — z-index 10, pointer-events: none on wrapper ─────────── */}
      <div className="relative z-10 w-full min-h-screen pointer-events-none flex flex-col">

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        {/* min-h-[64px] ensures iOS safe tap area across the nav bar */}
        <nav className="glass-nav flex items-center justify-between px-4 md:px-8 py-4 md:py-5 min-h-[64px] pointer-events-auto">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group" id="nav-logo">
            {/* Geometric mark */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rotate-45 border border-yellow-600/70 group-hover:rotate-90 transition-transform duration-700" />
              <div className="absolute inset-1.5 rotate-45 bg-gradient-to-br from-yellow-600 to-yellow-900 group-hover:rotate-0 transition-transform duration-700" />
            </div>
            <span
              className="text-2xl tracking-[0.25em] text-white font-light uppercase"
              style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.3em' }}
            >
              INKDARK
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  id={`nav-${item.label.toLowerCase()}`}
                  className="nav-link text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#book"
              id="nav-cta-book"
              className="cta-btn px-6 py-2.5 rounded-full text-sm font-semibold tracking-widest uppercase text-black"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile hamburger — min 44×44px touch target per Apple HIG */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-3 min-w-[44px] min-h-[44px] items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}
            />
            <span
              className={`block w-4 h-px bg-white/60 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-px bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}
            />
          </button>
        </nav>

        {/* Mobile menu — each item min-h-[44px] for ergonomic touch targets */}
        {mobileMenuOpen && (
          <div className="glass-nav md:hidden flex flex-col gap-1 px-4 py-4 pointer-events-auto">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center min-h-[44px] text-white/70 hover:text-white px-2 text-sm tracking-widest uppercase border-b border-white/5 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#book"
              className="cta-btn mt-3 px-6 py-3 min-h-[44px] rounded-full text-sm font-semibold tracking-widest uppercase text-black text-center flex items-center justify-center"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span>Book Now</span>
            </a>
          </div>
        )}

        {/* ── Hero Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex items-center">
          {/* Safe horizontal padding — tighter on mobile */}
          <div className="px-5 sm:px-8 md:px-16 lg:px-24 max-w-3xl">

            {/* Eyebrow tag */}
            <div
              className="animate-fade-in-up opacity-0 delay-100 inline-flex items-center gap-2 mb-6"
              style={{ pointerEvents: 'none' }}
            >
              <div className="w-6 h-px bg-gradient-to-r from-yellow-600 to-transparent" />
              <span
                className="text-xs tracking-[0.35em] text-yellow-500/80 uppercase"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Premium Tattoo Studio — Est. 2012
              </span>
            </div>

            {/* H1 — mobile-first clamp: starts at 3rem (48px) on tiny screens */}
            <h1
              className="animate-fade-in-up opacity-0 delay-200 leading-none mb-2"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 14vw, 9rem)',
                letterSpacing: '-0.01em',
                pointerEvents: 'none',
              }}
            >
              <span className="gradient-text block">BEYOND</span>
              <span className="gradient-text block">INK.</span>
            </h1>

            <h2
              className="animate-fade-in-up opacity-0 delay-300 mb-6 md:mb-8"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(2rem, 9vw, 5.5rem)',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              <span className="gradient-gold">PURE ART.</span>
            </h2>

            {/* Subheadline — hidden on very small screens to keep the hero clean */}
            <p
              className="animate-fade-in-up opacity-0 delay-400 hidden sm:block text-white/50 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md"
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 300,
                pointerEvents: 'none',
              }}
            >
              Where the body becomes the canvas and every line tells a story that lasts a lifetime. Crafted for those who refuse to settle for ordinary.
            </p>

            {/* CTA Buttons — min-h-[44px] for iOS touch ergonomics */}
            <div className="animate-fade-in-up opacity-0 delay-500 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pointer-events-auto">
              <a
                href="#consultation"
                id="hero-cta-primary"
                className="cta-btn px-6 md:px-8 py-3 md:py-4 min-h-[44px] rounded-full text-sm font-semibold tracking-[0.15em] uppercase text-black flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <span>Schedule Consultation</span>
              </a>

              <a
                href="#portfolio"
                id="hero-cta-portfolio"
                className="cta-btn-secondary px-6 md:px-8 py-3 md:py-4 min-h-[44px] rounded-full text-sm font-light tracking-[0.15em] uppercase text-white/80 hover:text-white flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                View Portfolio →
              </a>
            </div>
          </div>
        </main>

        {/* ── Bottom Bar — Stats hidden on mobile to avoid horizontal overflow */}
        <footer className="px-5 md:px-16 pb-8 md:pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

          {/* Stats — hidden on xs screens, shown from sm up */}
          <div className="animate-fade-in-up opacity-0 delay-600 hidden sm:flex gap-4 md:gap-6 pointer-events-auto">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card stat-card px-4 md:px-5 py-3 text-center"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                <p
                  className="gradient-gold font-black"
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-white/40 text-xs tracking-widest uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className="animate-fade-in-up opacity-0 delay-700 scroll-indicator hidden md:flex flex-col items-center gap-2"
            style={{ pointerEvents: 'none' }}
          >
            <span
              className="text-white/30 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Scroll
            </span>
            <div className="flex flex-col gap-1 items-center">
              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
              <div className="w-1 h-1 rounded-full bg-yellow-600/60" />
            </div>
          </div>
        </footer>
      </div>
    </>

      {/* ─── AUTHORITY SECTION ───────────────────────────────────────────── */}
      <AuthoritySection />

      {/* ─── PORTFOLIO SECTION ───────────────────────────────────────────── */}
      <PortfolioSection />

      {/* ─── TESTIMONIALS SECTION ───────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ─── PROCESS & FAQ SECTION ─────────────────────────────────────── */}
      <ProcessFaqSection />

      {/* ─── CTA & LEAD CAPTURE SECTION ────────────────────────────────── */}
      <CtaSection />
    </main>
  );
}
