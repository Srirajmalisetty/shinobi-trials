import React, { useState } from 'react';
import { SoundToggle } from '../components/common/SoundToggle';
import { ChakraSpinner } from '../components/common/ChakraSpinner';

export const ComponentVariantsPage: React.FC = () => {
  // State for interactive demos
  const [buttonPressed, setButtonPressed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'default' | 'correct' | 'incorrect'>('correct');
  const [activeWipeFrame, setActiveWipeFrame] = useState<number | null>(null);
  const [scrollExpanded, setScrollExpanded] = useState(true);
  const [isRankUpActive, setIsRankUpActive] = useState(true);

  const triggerEnergyWipe = () => {
    setActiveWipeFrame(1);
    setTimeout(() => setActiveWipeFrame(2), 350);
    setTimeout(() => setActiveWipeFrame(3), 700);
    setTimeout(() => setActiveWipeFrame(null), 1200);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen text-slate-100 space-y-12">
      {/* Full screen Energy Wipe Overlay Simulation */}
      {activeWipeFrame && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
          {activeWipeFrame === 1 && (
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#ff6b1a]/80 via-[#ffc93c]/60 to-transparent border-r-4 border-[#ffc93c] transition-all duration-300">
              <div className="absolute top-1/2 left-8 -translate-y-1/2 text-xl font-black text-white tracking-widest uppercase">
                Chakra Release...
              </div>
            </div>
          )}
          {activeWipeFrame === 2 && (
            <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-transparent via-[#ff6b1a]/90 to-[#ffc93c] border-r-8 border-white shadow-[0_0_50px_#ffc93c] transition-all duration-300">
              <div className="absolute top-1/2 right-12 -translate-y-1/2 text-2xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                <span>Sealing Rank Ledger...</span>
              </div>
            </div>
          )}
          {activeWipeFrame === 3 && (
            <div className="absolute inset-0 bg-[#1a1a36]/90 flex items-center justify-center transition-all duration-300">
              <div className="px-8 py-4 rounded-2xl bg-[#2e8b57] text-white text-2xl font-black tracking-widest shadow-[0_0_35px_rgba(46,139,87,0.8)] animate-bounce">
                CHŪNIN UNLOCKED
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header & Specification Bar */}
      <header className="pb-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-[#ff6b1a]/20 text-[#ff6b1a] border border-[#ff6b1a]/40">
              Design System v2.4 • Component Interaction Tokens
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: SHINOBI-INTERACTION-SPEC-01</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
            <span>Shinobi Trials</span>
            <span className="text-[#ff6b1a] font-normal text-2xl md:text-3xl">
              / Component States & Motion Variants
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Visual reference frames for short tactile micro-interactions, sound toggles, and state transitions mapped to client binding hooks.
          </p>
        </div>

        {/* Theme Palette Badges */}
        <div className="flex items-center gap-2 bg-[#121224] p-2.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FF6B1A]"></span>
            <span className="font-mono text-slate-300">#FF6B1A</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1A1A2E]"></span>
            <span className="font-mono text-slate-300">#1A1A2E</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#2E8B57]"></span>
            <span className="font-mono text-slate-300">#2E8B57</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFC93C]"></span>
            <span className="font-mono text-slate-300">#FFC93C</span>
          </div>
        </div>
      </header>

      {/* SECTION 1: PRIMARY BUTTON RIPPLE / CLICK STATE */}
      <section className="ninja-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-mono text-[#ff6b1a] font-bold tracking-wider">STATE SPEC 01</span>
            <h2 className="text-xl font-bold text-white">Primary Button — Default vs. Click / Pressed State</h2>
            <p className="text-xs text-slate-400 mt-0.5">Applied to: Start Trial, Accept Mission, Submit Exam, Download Certificate, Save Quiz.</p>
          </div>
          <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-slate-400 border border-white/10 font-mono">150ms – 400ms impulse</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0e0e22] p-6 sm:p-8 rounded-2xl border border-white/5">
          {/* Variant 1A: Default */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xs font-mono text-slate-400 mb-4 tracking-wide uppercase">
              Variant: <code className="text-white font-bold">Primary Button / Default</code>
            </span>
            <button className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] text-white font-bold text-sm tracking-wider uppercase chakra-glow-orange flex items-center gap-2 hover:brightness-110 transition shadow-lg">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Accept Mission
            </button>
            <span className="text-[11px] text-slate-500 mt-4 text-center">Resting State • Subtle ambient orange chakra glow</span>
          </div>

          {/* Variant 1B: Click / Pressed with Concentric Chakra Rings */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xs font-mono text-[#ffc93c] mb-4 tracking-wide uppercase">
              Variant: <code className="text-white font-bold">Primary Button / Click</code>
            </span>

            {/* Concentric radiating rings container */}
            <div className="relative inline-flex items-center justify-center">
              {/* Outermost radiating ring */}
              <span className="absolute inset-[-14px] rounded-2xl border-2 border-[#ffc93c]/30 pointer-events-none scale-105 animate-ping"></span>
              {/* Mid radiating ring */}
              <span className="absolute inset-[-7px] rounded-2xl border-2 border-[#ff6b1a]/60 pointer-events-none scale-100"></span>
              {/* Inner radiating ring */}
              <span className="absolute inset-[-2px] rounded-xl border border-[#ffc93c]/90 pointer-events-none"></span>

              <button
                onClick={() => setButtonPressed(!buttonPressed)}
                className={`relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e0580c] to-[#ff7a26] text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-inner border border-[#ffc93c] overflow-hidden transition-transform ${
                  buttonPressed ? 'scale-[0.95]' : 'scale-[0.98]'
                }`}
              >
                {/* Radial chakra ripple burst in center */}
                <span className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,201,60,0.65)_0%,_rgba(255,107,26,0.3)_45%,_transparent_75%)] pointer-events-none"></span>
                <svg className="w-4 h-4 fill-current text-[#ffc93c]" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span className="relative z-10 text-amber-100">Accept Mission (Click Me)</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 mt-4 text-center">
              Pressed Variant • 2-3 concentric orange-to-gold shockwaves radiating from center
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2 & 3: OPTION PILLS (CORRECT & INCORRECT HIT STATES) */}
      <section className="ninja-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-mono text-[#2e8b57] font-bold tracking-wider">STATE SPEC 02 & 03</span>
            <h2 className="text-xl font-bold text-white">Option Pill — Correct & Incorrect Tactical Reaction States</h2>
            <p className="text-xs text-slate-400 mt-0.5">Apply to: MCQ and True-False selector cards on Quiz Attempt & Practice Trials.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOption('default')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${selectedOption === 'default' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Default
            </button>
            <button
              onClick={() => setSelectedOption('correct')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${selectedOption === 'correct' ? 'bg-[#2e8b57] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Correct
            </button>
            <button
              onClick={() => setSelectedOption('incorrect')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${selectedOption === 'incorrect' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Incorrect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0e0e22] p-6 rounded-2xl border border-white/5">
          {/* Default State */}
          <div
            onClick={() => setSelectedOption('default')}
            className={`p-5 rounded-xl bg-[#14142b] border transition-all cursor-pointer flex flex-col justify-between ${
              selectedOption === 'default' ? 'border-[#ff6b1a] chakra-glow-orange' : 'border-white/10'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Variant: <code>Option Pill / Default</code></span>
              <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">A</span>
            </div>
            <div className="text-sm font-medium text-slate-200 mb-3">
              Directly challenge ocular focus to disrupt chakra pathways.
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-white/5">Unselected State • Muted navy background</div>
          </div>

          {/* Correct State (Green Glow + Starburst) */}
          <div
            onClick={() => setSelectedOption('correct')}
            className={`relative p-5 rounded-xl bg-[#12241b] border-2 border-[#2e8b57] chakra-glow-green flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${
              selectedOption === 'correct' ? 'ring-2 ring-emerald-400' : ''
            }`}
          >
            {/* Spark / Star burst icon in top-right corner with mid-fade opacity */}
            <div className="absolute top-2 right-2 text-[#4ade80] opacity-85 animate-pulse">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.8L12 22l-2.4-7.2L2.4 12l7.2-2.8L12 2z"/>
              </svg>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-mono text-[#4ade80] uppercase font-bold">Variant: <code>Option Pill / Correct</code></span>
              <span className="w-5 h-5 rounded-full bg-[#2e8b57] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            </div>
            <div className="text-sm font-medium text-emerald-100 mb-3 pr-6">
              Fight by anticipating footwork and shadow orientation without direct eye contact.
            </div>
            <div className="text-[11px] text-emerald-300/80 pt-2 border-t border-[#2e8b57]/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
              <span>Leaf Green Chakra Glow + Spark Particle (Mid-fade)</span>
            </div>
          </div>

          {/* Incorrect State (Red Glow + Deflected Crack Lines) */}
          <div
            onClick={() => setSelectedOption('incorrect')}
            className={`relative p-5 rounded-xl bg-[#261317] border-2 border-red-600 chakra-glow-red flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${
              selectedOption === 'incorrect' ? 'ring-2 ring-red-400' : ''
            }`}
          >
            {/* Crack / Deflected mark overlay in center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <svg className="w-24 h-24 stroke-red-400 stroke-2 fill-none" viewBox="0 0 100 100">
                <path d="M15,50 L45,45 L50,15 M45,45 L70,60 L85,45 M50,45 L40,85" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="flex justify-between items-center mb-3 relative z-10">
              <span className="text-[11px] font-mono text-red-400 uppercase font-bold">Variant: <code>Option Pill / Incorrect</code></span>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">✕</span>
            </div>
            <div className="text-sm font-medium text-red-100 mb-3 relative z-10">
              Expend maximum chakra in a sudden explosive release to rupture optical illusion.
            </div>
            <div className="text-[11px] text-red-300/80 pt-2 border-t border-red-500/30 flex items-center gap-1.5 relative z-10">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Red Perimeter Flash + Deflected Crack Overlay</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PAGE TRANSITION — ENERGY WIPE */}
      <section className="ninja-card p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-white/10 pb-3 gap-2">
          <div>
            <span className="text-xs font-mono text-[#ffc93c] font-bold tracking-wider">STATE SPEC 04</span>
            <h2 className="text-xl font-bold text-white">Page Transition — Shinobi Energy Wipe (Sequence Frames)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Applied to: Instant transition between Exam Submission and Results Dashboard.</p>
          </div>
          <button
            onClick={triggerEnergyWipe}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6b1a] to-[#ffc93c] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(255,107,26,0.5)] transition"
          >
            ⚡ Test Full Energy Wipe
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0e0e22] p-6 rounded-2xl border border-white/5">
          {/* Frame 1 */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 mb-2 font-bold uppercase">Variant: <code>Energy Wipe / Frame 01 (Initiate)</code></span>
            <div className="h-36 rounded-xl bg-[#14142b] border border-white/10 relative overflow-hidden flex items-center">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#ff6b1a]/70 via-[#ffc93c]/50 to-transparent border-r-2 border-[#ffc93c] blur-[1px]"></div>
              <div className="absolute left-6 text-xs font-bold text-white tracking-widest uppercase opacity-40">Exam Complete</div>
            </div>
            <span className="text-[11px] text-slate-400 mt-2">t = 0.1s • Orange chakra surge enters from screen left</span>
          </div>

          {/* Frame 2 */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#ffc93c] mb-2 font-bold uppercase">Variant: <code>Energy Wipe / Frame 02 (Mid-Sweep)</code></span>
            <div className="h-36 rounded-xl bg-[#14142b] border border-white/10 relative overflow-hidden flex items-center">
              <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-transparent via-[#ff6b1a]/80 to-[#ffc93c]/90 border-r-4 border-white shadow-[0_0_25px_#ffc93c]"></div>
              <div className="absolute right-8 text-xs font-bold text-white tracking-widest uppercase opacity-70 flex items-center gap-1.5">
                <span>Sealing Rank Ledger...</span>
              </div>
            </div>
            <span className="text-[11px] text-amber-300 mt-2">t = 0.4s • Golden radiant wavefront crosses view center</span>
          </div>

          {/* Frame 3 */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#2e8b57] mb-2 font-bold uppercase">Variant: <code>Energy Wipe / Frame 03 (Resolve)</code></span>
            <div className="h-36 rounded-xl bg-[#1a1a36] border border-[#2e8b57]/40 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-radial from-transparent via-white/5 to-[#ff6b1a]/10"></div>
              <div className="text-center z-10">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#2e8b57] text-white tracking-wider">CHŪNIN UNLOCKED</span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 mt-2">t = 0.8s • Wipe concludes revealing Results Page</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: CERTIFICATE UNLOCK / UNROLL STATE */}
      <section className="ninja-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-mono text-[#ff6b1a] font-bold tracking-wider">STATE SPEC 05</span>
            <h2 className="text-xl font-bold text-white">Certificate Scroll — Unlock & Unroll Lifecycle States</h2>
            <p className="text-xs text-slate-400 mt-0.5">Applied to: CertificatePage on-load progression variant.</p>
          </div>
          <button
            onClick={() => setScrollExpanded(!scrollExpanded)}
            className="text-xs px-3 py-1 rounded-full bg-white/10 text-[#ffc93c] border border-[#ffc93c]/30 hover:bg-[#ffc93c]/20 transition font-mono"
          >
            Toggle: {scrollExpanded ? 'View Partial' : 'View Full Glow'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0e0e22] p-6 rounded-2xl border border-white/5">
          {/* Variant 5A: Partially Unrolled */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-300 mb-3 uppercase font-bold">Variant: <code>Certificate Scroll / Partial Unroll</code></span>
            <div className="h-56 rounded-xl parchment-border relative overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="absolute top-2 inset-x-8 h-4 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 rounded-full shadow-md flex items-center justify-between px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span>
              </div>
              
              <div className="text-center opacity-40 my-auto">
                <div className="text-xs tracking-widest text-[#ffc93c] uppercase font-bold">Leaf Academy Archives</div>
                <div className="w-32 h-1 bg-[#ffc93c]/30 mx-auto my-1"></div>
                <div className="text-[11px] text-slate-400">Scroll seal breaking...</div>
              </div>

              <div className="absolute bottom-10 inset-x-8 h-4 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 rounded-full shadow-lg flex items-center justify-between px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 mt-2">Partially Unrolled • Compact cylinder unspooling downward</span>
          </div>

          {/* Variant 5B: Fully Unrolled with Gold Aura Pulse */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#ffc93c] mb-3 uppercase font-bold">Variant: <code>Certificate Scroll / Unlocked Glow</code></span>
            <div className="h-56 rounded-xl border-2 border-[#ffc93c] chakra-glow-gold relative overflow-hidden flex flex-col justify-between p-4 bg-gradient-to-b from-[#1c1c36] to-[#121226]">
              <div className="h-3.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-full shadow-md flex justify-between items-center px-2">
                <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
              </div>

              <div className="text-center my-auto">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ff6b1a]/20 text-[#ffc93c] border border-[#ffc93c]/40 uppercase tracking-widest">Seal Ratified</span>
                <h3 className="text-lg font-black text-white mt-1">NARUTO UZUMAKI</h3>
                <p className="text-xs text-amber-200/90 font-medium">Rank of Chūnin Formally Bestowed</p>
              </div>

              <div className="h-3.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-full shadow-md flex justify-between items-center px-2">
                <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
              </div>
            </div>
            <span className="text-[11px] text-amber-300 mt-2">Fully Unrolled • Radiant gold border aura indicating active validation</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: SCORE BADGE RANK-UP / COUNT-UP STATE */}
      <section className="ninja-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-mono text-[#2e8b57] font-bold tracking-wider">STATE SPEC 06</span>
            <h2 className="text-xl font-bold text-white">Score Badge — Rank-Up & Counting State</h2>
            <p className="text-xs text-slate-400 mt-0.5">Applied to: Results Page circular meter on initial assessment completion.</p>
          </div>
          <button
            onClick={() => setIsRankUpActive(!isRankUpActive)}
            className="text-xs px-3 py-1 rounded-full bg-white/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/20 transition font-mono"
          >
            Toggle: {isRankUpActive ? 'Show Static' : 'Trigger Promotion'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0e0e22] p-6 rounded-2xl border border-white/5">
          {/* Static Default */}
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-[11px] font-mono text-slate-400 mb-4 uppercase">Variant: <code>Score Badge / Static Result</code></span>
            <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex flex-col items-center justify-center bg-[#14142b]">
              <span className="text-2xl font-black text-slate-200">88%</span>
              <span className="text-[10px] text-slate-400 uppercase">Passed</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-4">Static resting score ring</span>
          </div>

          {/* Radiating Rank-Up Variant with Ribbon */}
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-[11px] font-mono text-[#ffc93c] mb-4 uppercase font-bold">Variant: <code>Score Badge / Rank-Up Flash</code></span>
            
            <div className="relative flex flex-col items-center">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#ff6b1a]/40 via-[#ffc93c]/50 to-transparent blur-md animate-pulse"></div>
              
              <div className="relative w-36 h-36 rounded-full border-4 border-[#2e8b57] flex flex-col items-center justify-center bg-[#181838] chakra-glow-green shadow-2xl">
                <span className="text-3xl font-black text-white tracking-tight animate-pulse">88%</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Ascending</span>
              </div>

              <div className="-mt-3 relative z-10 px-4 py-1.5 rounded-md bg-gradient-to-r from-[#ff6b1a] to-[#ffc93c] text-black font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-amber-200">
                <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z"/></svg>
                <span>Chūnin Rank</span>
              </div>
            </div>

            <span className="text-[11px] text-amber-300 mt-4 text-center">Counting Complete • Radiating aura + Gold promotion ribbon appearance</span>
          </div>
        </div>
      </section>

      {/* SECTION 7 & 8: SOUND TOGGLE ICON & CHAKRA LOADING SPINNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOUND TOGGLE COMPONENT */}
        <section className="ninja-card p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-[#ffc93c] font-bold tracking-wider">STATE SPEC 07</span>
                <h2 className="text-lg font-bold text-white">Sound Toggle Icon (2 States)</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Navbar Control</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Standard audio feedback toggle embedded in top Academy navigation across all screens.</p>

            <div className="grid grid-cols-2 gap-4 bg-[#0e0e22] p-6 rounded-2xl border border-white/5">
              {/* Active State Demo */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#14142b] border border-[#ffc93c]/30">
                <span className="text-[10px] font-mono text-[#ffc93c] mb-3 uppercase font-bold">Variant: <code>Sound / Active</code></span>
                <div className="w-12 h-12 rounded-xl bg-[#1c1c38] border border-[#ffc93c] chakra-glow-gold flex items-center justify-center text-[#ffc93c]">
                  <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[11px] text-amber-200 mt-3 font-medium">Glowing Gold + Waves</span>
              </div>

              {/* Muted State Demo */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#14142b] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 mb-3 uppercase">Variant: <code>Sound / Muted</code></span>
                <div className="w-12 h-12 rounded-xl bg-[#121224] border border-white/10 flex items-center justify-center text-slate-500">
                  <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                    <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round"/>
                    <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[11px] text-slate-500 mt-3 font-medium">Dimmed + Slash Mark</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-300">Live Interactive Navbar Widget:</span>
              <SoundToggle />
            </div>
          </div>
        </section>

        {/* CHAKRA LOADING SPINNER */}
        <section className="ninja-card p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-[#ff6b1a] font-bold tracking-wider">STATE SPEC 08</span>
                <h2 className="text-lg font-bold text-white">Chakra Spinner (Async Loading)</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Rotational Frames</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Continuous async chakra gathering ring for Mission Board data fetches and AI grading queues.</p>

            <div className="bg-[#0e0e22] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#ff6b1a] mb-4 uppercase font-bold">Variant: <code>Loading State / Chakra Spinner</code></span>
              
              {/* 3 Rotational Progress Phases + Live Component */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Frame 0 deg */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#ff6b1a] border-r-[#ffc93c] chakra-glow-orange rotate-0"></div>
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ffc93c]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2">Frame A (0°)</span>
                </div>

                {/* Frame 120 deg */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#ff6b1a] border-r-[#ffc93c] chakra-glow-orange rotate-[120deg]"></div>
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ffc93c]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2">Frame B (120°)</span>
                </div>

                {/* Live Animated Component */}
                <div className="flex flex-col items-center bg-black/40 px-4 py-2 rounded-xl border border-[#ff6b1a]/40">
                  <ChakraSpinner size="md" />
                  <span className="text-[10px] font-mono text-[#ffc93c] mt-2 font-bold">Live Rotation (1.2s)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-between text-[11px] text-slate-400">
                <span>Rotation: <code>infinite linear 1.2s</code></span>
                <span className="text-[#ffc93c]">Gradient: Orange-to-Gold</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
        <div>Hidden Leaf Ninja Academy Exam Registry • Automated Component State Mapping</div>
        <div className="font-mono">Consistent MCP Ref Schema: [Component] / [State]</div>
      </footer>
    </div>
  );
};
export default ComponentVariantsPage;
