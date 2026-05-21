'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║           CHECKMATE CTA — LEAD CAPTURE & CONSULTATION REQUEST           ║
 * ║              Ultra-Premium Glassmorphism · Controlled Form              ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  CUSTOMIZATION:                                                          ║
 * ║  • Update WHATSAPP_NUMBER with your studio's number (digits only).      ║
 * ║  • Edit QUARTER_LABEL for the current booking quarter.                  ║
 * ║  • Edit AVAILABILITY_COUNT for real-time slot messaging.                ║
 * ║  • The `onSubmit` mock can be replaced with your API call or form       ║
 * ║    service (Formspree, Resend, etc.).                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useId } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  Variants,
} from 'framer-motion';

// ─── Studio Config ────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER  = '5511999999999';   // digits only, with country code
const QUARTER_LABEL    = 'Q3 2026';
const AVAILABILITY_COUNT = 4;              // number shown in the scarcity badge

// ─── Types ────────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  concept: string;
  placement: string;
  style: string;
  budget: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  concept: '',
  placement: '',
  style: '',
  budget: '',
};

// ─── Style options ────────────────────────────────────────────────────────────

const STYLE_OPTIONS = [
  'Micro Realism',
  'Blackwork',
  'Fine Line',
  'Japanese',
  'Neo-Traditional',
  'Dotwork',
  'Not sure yet',
];

const BUDGET_OPTIONS = [
  'Under R$ 1,500',
  'R$ 1,500 – R$ 3,000',
  'R$ 3,000 – R$ 6,000',
  'R$ 6,000+',
  'Let\'s discuss',
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 60, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const fieldVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const successVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

// ─── Minimal Input Field ──────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  index: number;
  inView: boolean;
}

function Field({
  label, id, value, onChange, placeholder = '',
  type = 'text', required = false, index, inView,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <motion.div
      variants={fieldVariants}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="relative flex flex-col gap-0 group"
    >
      {/* Floating label */}
      <label
        htmlFor={id}
        className="block text-xs tracking-[0.35em] uppercase mb-3 transition-colors duration-300"
        style={{
          fontFamily: 'var(--font-inter)',
          color: focused
            ? 'rgba(201,168,76,0.8)'
            : filled
            ? 'rgba(255,255,255,0.35)'
            : 'rgba(255,255,255,0.25)',
        }}
      >
        {label}
        {required && (
          <span className="ml-1 text-yellow-600/50">*</span>
        )}
      </label>

      {/* Input — CRITICAL: text-base (16px) prevents iOS Safari auto-zoom on focus */}
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="
          w-full bg-transparent pb-3 text-base font-light
          placeholder:text-white/15 outline-none caret-yellow-500
          border-b transition-all duration-400
        "
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '16px',   /* iOS Safari: must be >= 16px to suppress zoom */
          color: 'rgba(255,255,255,0.85)',
          borderBottomColor: focused
            ? 'rgba(201,168,76,0.7)'
            : filled
            ? 'rgba(255,255,255,0.25)'
            : 'rgba(255,255,255,0.10)',
          borderBottomWidth: focused ? '1.5px' : '1px',
        }}
      />

      {/* Focus glow on the border */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-yellow-600 to-yellow-400 pointer-events-none"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: focused ? 1 : 0,
          opacity: focused ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0, width: '100%' }}
      />
    </motion.div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  index: number;
  inView: boolean;
}

function SelectField({
  label, id, value, onChange, options, index, inView,
}: SelectFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <motion.div
      variants={fieldVariants}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="relative flex flex-col gap-0"
    >
      <label
        htmlFor={id}
        className="block text-xs tracking-[0.35em] uppercase mb-3 transition-colors duration-300"
        style={{
          fontFamily: 'var(--font-inter)',
          color: focused
            ? 'rgba(201,168,76,0.8)'
            : filled
            ? 'rgba(255,255,255,0.35)'
            : 'rgba(255,255,255,0.25)',
        }}
      >
        {label}
      </label>

      <div className="relative">
        {/* Select — CRITICAL: font-size 16px prevents iOS Safari auto-zoom */}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="
            w-full bg-transparent pb-3 text-base font-light
            outline-none appearance-none cursor-pointer
            border-b transition-all duration-400 pr-6
          "
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',   /* iOS Safari: must be >= 16px to suppress zoom */
            color: value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
            borderBottomColor: focused
              ? 'rgba(201,168,76,0.7)'
              : filled
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.10)',
            borderBottomWidth: focused ? '1.5px' : '1px',
          }}
        >
          <option value="" disabled style={{ background: '#0a0a0a', color: '#555' }}>
            Select an option
          </option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              style={{ background: '#0a0a0a', color: '#ccc' }}
            >
              {opt}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <svg
          className="absolute right-0 top-1 pointer-events-none transition-transform duration-300"
          style={{ transform: focused ? 'rotate(180deg)' : 'rotate(0deg)' }}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke={focused ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.25)'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Focus underline glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-yellow-600 to-yellow-400 pointer-events-none"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0, width: '100%' }}
      />
    </motion.div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({ name }: { name: string }) {
  return (
    <motion.div
      variants={successVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center text-center py-16 px-6 gap-8"
    >
      {/* Animated checkmark ring */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer ring pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border border-yellow-600/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, repeat: 1, ease: 'easeOut' }}
        />
        {/* Ring */}
        <div className="w-16 h-16 rounded-full border border-yellow-600/50 bg-yellow-600/8 flex items-center justify-center">
          {/* Checkmark SVG drawn with Framer Motion */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 12.5L10 17.5L19 8"
              stroke="rgba(201,168,76,0.9)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-white leading-none"
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.03em',
          }}
        >
          APPLICATION{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #f5d98b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            RECEIVED.
          </span>
        </h3>
        <p
          className="text-white/45 text-sm leading-relaxed max-w-sm mx-auto"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Thank you, <span className="text-white/70">{name || 'future client'}</span>.
          {' '}Your application is under review. One of our artists will reach out within 48 hours to begin your journey.
        </p>
      </div>

      {/* WhatsApp fast-track */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20INKDARK%2C%20I%20just%20submitted%20a%20consultation%20request%20and%20wanted%20to%20connect%20directly.`}
        target="_blank"
        rel="noopener noreferrer"
        id="success-whatsapp-cta"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-green-500/25 bg-green-500/5 hover:bg-green-500/10 hover:border-green-400/40 text-green-400/80 hover:text-green-300 text-sm tracking-widest uppercase transition-all duration-400 group"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {/* WhatsApp icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>Fast-track via WhatsApp</span>
      </a>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function CtaSection() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus]     = useState<FormStatus>('idle');
  const [btnHovered, setBtnHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  const sectionInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const cardInView    = useInView(cardRef,    { once: true, margin: '-40px' });

  // Field id prefix (avoids SSR hydration collision if section is used twice)
  const uid = useId();

  // ── Form helpers ──────────────────────────────────────────────────────────
  function setField<K extends keyof FormData>(key: K, val: string) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  /**
   * Mock submit handler.
   * Replace the setTimeout with your real API call or form service.
   * On success you can also redirect to WhatsApp:
   *   window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=...`, '_blank')
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');

    // Simulate network request
    await new Promise((res) => setTimeout(res, 1800));

    // ── Uncomment to redirect to WhatsApp instead ──────────────────────────
    // const msg = encodeURIComponent(
    //   `Hi INKDARK! My name is ${formData.name}.\n` +
    //   `Concept: ${formData.concept}\n` +
    //   `Placement: ${formData.placement}\n` +
    //   `Style: ${formData.style}\n` +
    //   `Budget: ${formData.budget}`
    // );
    // window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    // setStatus('idle');
    // return;

    setStatus('success');
  }

  const isValid = formData.name.trim().length > 0 && formData.concept.trim().length > 0;

  return (
    <section
      ref={sectionRef}
      id="consultation"
      className="relative bg-black py-24 md:py-40 overflow-hidden"
      aria-label="Request a Consultation"
    >
      {/* ── Ambient background glows ─────────────────────────────────────── */}
      {/* Central amber glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={sectionInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Top-left cold accent */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)',
        }}
      />

      {/* Bottom-right cold accent */}
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* ── Pre-card header ──────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 md:mb-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 32 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-yellow-600/70" />
            <span
              className="text-yellow-500/60 text-xs tracking-[0.5em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              By Application Only
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-yellow-600/70" />
          </div>

          {/* Main headline — mobile-first clamp */}
          <h2
            className="text-white leading-none text-center"
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.2rem, 9vw, 7rem)',
              letterSpacing: '-0.01em',
            }}
          >
            YOUR VISION.{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #c9a84c 0%, #f5d98b 40%, #c9a84c 70%, #a07830 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              OUR MASTERPIECE.
            </span>
          </h2>

          {/* Scarcity badge */}
          <div className="flex items-center gap-2 mt-1">
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-600" />
            </span>
            <span
              className="text-white/35 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Currently accepting applications for {QUARTER_LABEL} —{' '}
              <span className="text-yellow-500/60">
                {AVAILABILITY_COUNT} spots remaining
              </span>
            </span>
          </div>
        </motion.div>

          {/* Glassmorphism card — tighter padding on mobile */}
        <motion.div
          ref={cardRef}
          variants={cardVariants}
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          className="
            relative rounded-3xl overflow-hidden
            border border-white/10
            bg-black/40 backdrop-blur-xl
            shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
          "
        >
          {/* Inner top-edge glow */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-5 left-5 w-5 h-5 opacity-30">
            <div className="absolute top-0 left-0 w-full h-px bg-yellow-500" />
            <div className="absolute top-0 left-0 w-px h-full bg-yellow-500" />
          </div>
          <div className="absolute top-5 right-5 w-5 h-5 opacity-30">
            <div className="absolute top-0 right-0 w-full h-px bg-yellow-500" />
            <div className="absolute top-0 right-0 w-px h-full bg-yellow-500" />
          </div>
          <div className="absolute bottom-5 left-5 w-5 h-5 opacity-30">
            <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-500" />
            <div className="absolute bottom-0 left-0 w-px h-full bg-yellow-500" />
          </div>
          <div className="absolute bottom-5 right-5 w-5 h-5 opacity-30">
            <div className="absolute bottom-0 right-0 w-full h-px bg-yellow-500" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-yellow-500" />
          </div>

          {/* ── Form / Success content ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <SuccessState key="success" name={formData.name} />
            ) : (
              /* Form container — tighter padding on mobile */
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="p-6 sm:p-8 md:p-12"
              >
                {/* Form subtitle */}
                <p
                  className="text-white/30 text-xs tracking-[0.35em] uppercase text-center mb-10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Complete the form below — we'll handle the rest
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-10"
                >
                  {/* ── Row 1: Name ──────────────────────────────────────── */}
                  <Field
                    label="Your Name"
                    id={`${uid}-name`}
                    value={formData.name}
                    onChange={(v) => setField('name', v)}
                    placeholder="As you'd like to be addressed"
                    required
                    index={0}
                    inView={cardInView}
                  />

                  {/* ── Row 2: Concept ────────────────────────────────────── */}
                  <Field
                    label="Your Concept or Idea"
                    id={`${uid}-concept`}
                    value={formData.concept}
                    onChange={(v) => setField('concept', v)}
                    placeholder="Describe your vision — the more detail, the better"
                    required
                    index={1}
                    inView={cardInView}
                  />

                  {/* ── Row 3: Placement ─────────────────────────────────── */}
                  <Field
                    label="Body Placement"
                    id={`${uid}-placement`}
                    value={formData.placement}
                    onChange={(v) => setField('placement', v)}
                    placeholder="e.g. Inner forearm, rib cage, full sleeve…"
                    index={2}
                    inView={cardInView}
                  />

                  {/* ── Row 4: Style + Budget ────────────────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <SelectField
                      label="Preferred Style"
                      id={`${uid}-style`}
                      value={formData.style}
                      onChange={(v) => setField('style', v)}
                      options={STYLE_OPTIONS}
                      index={3}
                      inView={cardInView}
                    />
                    <SelectField
                      label="Approximate Budget"
                      id={`${uid}-budget`}
                      value={formData.budget}
                      onChange={(v) => setField('budget', v)}
                      options={BUDGET_OPTIONS}
                      index={4}
                      inView={cardInView}
                    />
                  </div>

                  {/* ── Divider ───────────────────────────────────────────── */}
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"
                    variants={fieldVariants}
                    custom={5}
                    initial="hidden"
                    animate={cardInView ? 'visible' : 'hidden'}
                  />

                  {/* ── Submit Button ─────────────────────────────────────── */}
                  <motion.div
                    variants={fieldVariants}
                    custom={6}
                    initial="hidden"
                    animate={cardInView ? 'visible' : 'hidden'}
                    className="flex flex-col items-center gap-5"
                  >
                    <motion.button
                      id="cta-submit-consultation"
                      type="submit"
                      disabled={!isValid || status === 'submitting'}
                      onHoverStart={() => setBtnHovered(true)}
                      onHoverEnd={() => setBtnHovered(false)}
                      whileHover={{ scale: isValid ? 1.02 : 1 }}
                      whileTap={{ scale: isValid ? 0.98 : 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="
                        relative w-full py-4 md:py-5 min-h-[44px] rounded-2xl overflow-hidden
                        text-sm tracking-[0.22em] uppercase font-medium
                        transition-all duration-500
                        disabled:opacity-40 disabled:cursor-not-allowed
                        focus-visible:outline focus-visible:outline-yellow-600/50
                      "
                      style={{
                        fontFamily: 'var(--font-inter)',
                        background: btnHovered && isValid
                          ? 'rgba(255,255,255,1)'
                          : 'rgba(255,255,255,0.06)',
                        color: btnHovered && isValid
                          ? '#000'
                          : 'rgba(255,255,255,0.85)',
                        border: `1px solid ${
                          btnHovered && isValid
                            ? 'rgba(255,255,255,1)'
                            : 'rgba(255,255,255,0.15)'
                        }`,
                        boxShadow: btnHovered && isValid
                          ? '0 0 50px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)'
                          : '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Animated gold sweep on hover */}
                      <motion.span
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={
                          btnHovered && isValid
                            ? { x: '100%', opacity: [0, 0.15, 0] }
                            : { x: '-100%', opacity: 0 }
                        }
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
                        }}
                      />

                      <span className="relative z-10">
                        {status === 'submitting' ? (
                          <span className="flex items-center justify-center gap-3">
                            {/* Spinner */}
                            <motion.span
                              className="block w-4 h-4 rounded-full border border-current border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            Submitting Application…
                          </span>
                        ) : (
                          'Request Consultation'
                        )}
                      </span>
                    </motion.button>

                    {/* Trust micro-copy */}
                    <p
                      className="text-white/20 text-xs text-center leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      No commitment required. We review every application personally
                      and respond within 48 hours.
                    </p>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── WhatsApp alternative ─────────────────────────────────────────── */}
        {status !== 'success' && (
          <motion.div
            className="mt-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <span
              className="text-white/15 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Prefer to talk directly?
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20INKDARK%2C%20I'd%20like%20to%20discuss%20a%20custom%20tattoo%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-direct"
              className="group inline-flex items-center gap-2.5 text-sm text-white/30 hover:text-green-400/80 transition-colors duration-400"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 group-hover:opacity-100 transition-opacity">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Message us on WhatsApp</span>
              <span className="w-0 group-hover:w-4 h-px bg-green-500/50 transition-all duration-400" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
