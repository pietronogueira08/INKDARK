'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              PROCESS & FAQ SECTION — ELEGANT ACCORDION LAYOUT           ║
 * ║           Sticky Heading · AnimatePresence · Dark Mode Premium          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  CUSTOMIZATION:                                                          ║
 * ║  • Edit FAQ_ITEMS to update questions, answers, and category labels.    ║
 * ║  • Set allowMultiple = true to let several items open simultaneously.   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Set to `true` to allow multiple FAQ items to be open at the same time.
 * Set to `false` for classic single-open accordion behaviour.
 */
const ALLOW_MULTIPLE = false;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  id: string;
  category: string; // e.g. "Process", "Safety"
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'Booking',
    question: 'How do I secure a booking at INKDARK?',
    answer:
      'All bookings begin with a complimentary consultation — in-studio or via a private video call. During this session your artist reviews your concept, discusses placement, scale, and estimated sessions. A non-refundable deposit (credited to your final session) is then required to lock your date. We do not accept walk-ins; every client receives our undivided, scheduled attention.',
  },
  {
    id: 'faq-02',
    category: 'Design',
    question: 'How does the custom design process work?',
    answer:
      'After your consultation, your artist enters a private design phase — typically 2 to 4 weeks depending on complexity. You receive a first draft for review, followed by up to two rounds of revisions. The design is never shared externally or reused; it exists solely as yours. You will see the final artwork the morning of your appointment for a last approval before we begin.',
  },
  {
    id: 'faq-03',
    category: 'Pricing',
    question: 'How are sessions priced?',
    answer:
      'We operate on a day-rate and half-day-rate model rather than hourly pricing, which incentivises your artist to focus entirely on quality rather than speed. Rates vary by artist seniority and design complexity. Exact quotes are provided post-consultation. We do not negotiate on pricing — the rate reflects the skill, time, and materials required to produce work that will last a lifetime.',
  },
  {
    id: 'faq-04',
    category: 'Safety',
    question: 'What hygiene and safety standards do you maintain?',
    answer:
      'We adhere to medical-grade sterilisation protocols. All needles, cartridges, and ink caps are single-use and opened in front of you. Surfaces are clinical-grade disinfected between every client. Our artists hold current bloodborne pathogen certifications renewed annually. The studio is inspected and licensed by the municipal health authority — our certificates are displayed at reception.',
  },
  {
    id: 'faq-05',
    category: 'Healing',
    question: 'What is the aftercare and healing protocol?',
    answer:
      'Each client receives a printed aftercare guide tailored to their skin type, placement, and ink density. We use a two-phase system: a medical-grade film wrap for the first 72 hours, followed by a fragrance-free, vegan moisturiser for weeks 2–4. A complimentary touch-up session is included within 3 months of the original appointment to address any uneven healing — at no additional cost.',
  },
  {
    id: 'faq-06',
    category: 'Design',
    question: 'Can I bring my own reference images or design?',
    answer:
      'Absolutely. Reference images are a valuable part of the consultation — they communicate mood, line weight, shading style, and scale far more precisely than words alone. However, INKDARK does not replicate another artist\'s work verbatim. Your references guide a bespoke creation; they are a starting point, never a tracing template. This ensures your piece is unique and carries no intellectual property concerns.',
  },
  {
    id: 'faq-07',
    category: 'Process',
    question: 'How long does a session typically last?',
    answer:
      'Half-day sessions run approximately 4 hours of active tattooing; full-day sessions up to 7 hours, with a mandatory mid-session break for both client and artist. Large-scale or multi-session work is spaced a minimum of 8 weeks apart to allow complete healing before proceeding. Your artist will outline the projected session count during the consultation phase.',
  },
  {
    id: 'faq-08',
    category: 'Booking',
    question: 'What is your cancellation and rescheduling policy?',
    answer:
      'Appointments may be rescheduled with 7 days notice at no penalty — your deposit rolls forward. Cancellations within 7 days forfeit the deposit. No-shows forfeit both the deposit and the right to rebook with that artist. We enforce this policy out of respect for our artists\' time and the clients who are waitlisted for those appointments.',
  },
];

// ─── Process Steps (left panel secondary content) ─────────────────────────────

const PROCESS_STEPS = [
  { number: '01', label: 'Consultation' },
  { number: '02', label: 'Custom Design' },
  { number: '03', label: 'Your Session' },
  { number: '04', label: 'Aftercare' },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const answerVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const iconVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 45, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Category Pill ────────────────────────────────────────────────────────────

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-widest uppercase text-white/30 border border-white/8 bg-white/4 mr-4 flex-shrink-0"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {label}
    </span>
  );
}

// ─── Single Accordion Item ────────────────────────────────────────────────────

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function AccordionItem({ item, isOpen, onToggle, index }: AccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="border-b border-white/8 last:border-b-0"
    >
      {/* Question row — min-h-[44px] satisfies iOS/Android touch target guidelines */}
      <button
        id={`faq-toggle-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        onClick={onToggle}
        className={`
          w-full flex items-start gap-3 md:gap-4 text-left
          px-4 md:px-5 py-4 md:py-6 min-h-[56px] rounded-xl
          transition-colors duration-300
          ${isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}
          group
        `}
      >
        {/* Category pill (hidden on mobile) */}
        <CategoryPill label={item.category} />

        {/* Question text */}
        <span
          className={`
            flex-1 text-sm md:text-base lg:text-lg leading-snug transition-colors duration-300
            ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white/90'}
          `}
          style={{ fontFamily: 'var(--font-inter)', fontWeight: isOpen ? 500 : 400 }}
        >
          {item.question}
        </span>

        {/* Animated "+" icon */}
        <motion.div
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          className={`
            flex-shrink-0 mt-0.5
            w-7 h-7 rounded-full border flex items-center justify-center
            transition-colors duration-300
            ${
              isOpen
                ? 'border-yellow-600/50 bg-yellow-600/10'
                : 'border-white/15 bg-white/5 group-hover:border-white/25'
            }
          `}
          aria-hidden="true"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
          >
            <line
              x1="5.5"
              y1="0"
              x2="5.5"
              y2="11"
              stroke={isOpen ? '#c9a84c' : 'rgba(255,255,255,0.6)'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="5.5"
              x2="11"
              y2="5.5"
              stroke={isOpen ? '#c9a84c' : 'rgba(255,255,255,0.6)'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </button>

      {/* ── Answer panel with AnimatePresence ────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-toggle-${item.id}`}
            key={`answer-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.18 },
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              variants={answerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-4 md:px-5 pb-6 md:pb-7 pt-1"
            >
              {/* Left gold accent bar */}
              <div className="flex gap-3 md:gap-5">
                <div className="hidden sm:block flex-shrink-0 w-px self-stretch bg-gradient-to-b from-yellow-600/40 via-yellow-600/20 to-transparent ml-[4.5rem]" />

                <p
                  className="text-zinc-400 text-sm md:text-base leading-relaxed font-light"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({ headerInView }: { headerInView: boolean }) {
  return (
    <motion.div
      className="md:sticky md:top-24 flex flex-col gap-10 self-start"
      initial={{ opacity: 0, x: -32 }}
      animate={headerInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-px bg-gradient-to-r from-yellow-600/80 to-transparent" />
        <span
          className="text-yellow-500/60 text-xs tracking-[0.45em] uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Clarity First
        </span>
      </div>

      {/* Heading */}
      <h2
        className="leading-none text-white"
        style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(3rem, 6vw, 5.5rem)',
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
          PROCESS.
        </span>
        <br />
        YOUR
        <br />
        QUESTIONS.
      </h2>

      {/* Body copy */}
      <p
        className="text-white/35 text-sm leading-relaxed font-light max-w-xs"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        We believe informed clients make the best collaborators. Every question below reflects a real conversation we've had in this studio.
      </p>

      {/* Process steps */}
      <div className="flex flex-col gap-0">
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.number}
            className="flex items-center gap-4 py-4 border-b border-white/6 last:border-b-0 group"
          >
            {/* Number */}
            <span
              className="text-white/15 w-8 flex-shrink-0"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
              }}
            >
              {step.number}
            </span>

            {/* Connector line */}
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-px bg-white/10 group-hover:w-6 group-hover:bg-yellow-600/50 transition-all duration-400" />
              <span
                className="text-white/50 text-sm group-hover:text-white/80 transition-colors duration-400"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {step.label}
              </span>
            </div>

            {/* Step indicator dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-yellow-600/60 transition-colors duration-400 flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#consultation"
        id="faq-cta-book"
        className="pointer-events-auto group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-300"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        <span>Start Your Journey</span>
        <span className="w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-yellow-600/60 transition-all duration-500" />
      </a>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ProcessFaqSection() {
  // Track which items are open (Set supports multi-open mode)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!ALLOW_MULTIPLE) next.clear(); // close all others
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section
      id="process"
      className="relative bg-zinc-950 py-16 md:py-36 overflow-clip"
      aria-label="Process & FAQ"
    >
      {/* ── Ambient background ────────────────────────────────────────────── */}
      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Left glow */}
      <div
        className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16 lg:gap-24 items-start"
        >
          {/* ── LEFT: sticky heading + process steps ──────────────────────── */}
          <LeftPanel headerInView={headerInView} />

          {/* ── RIGHT: accordion ─────────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 24 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Accordion container */}
            <div
              className="rounded-2xl border border-white/6 bg-white/[0.02] overflow-hidden"
              role="list"
            >
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openIds.has(item.id)}
                  onToggle={() => toggle(item.id)}
                  index={index}
                />
              ))}
            </div>

            {/* Bottom note */}
            <motion.p
              className="mt-8 text-white/20 text-xs leading-relaxed text-center"
              style={{ fontFamily: 'var(--font-inter)' }}
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Have a question not listed here?{' '}
              <a
                href="#contact"
                className="text-yellow-600/50 hover:text-yellow-500/80 underline underline-offset-4 transition-colors duration-300 pointer-events-auto"
              >
                Send us a private message
              </a>{' '}
              — we respond within 24 hours.
            </motion.p>
          </motion.div>
        </div>

        {/* ── Horizontal decorative divider ────────────────────────────────── */}
        <div className="mt-24 flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-yellow-600/40" />
            <span
              className="text-white/15 text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              INKDARK
            </span>
            <div className="w-1 h-1 rounded-full bg-yellow-600/40" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </div>
    </section>
  );
}
