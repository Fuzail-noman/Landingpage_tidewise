import { useEffect, useRef, useState } from "react";

/* Tidewise — landing page (React + Tailwind). Fonts: add to index.html:
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
*/

const css = `
.font-display{font-family:'Bricolage Grotesque',system-ui,sans-serif}
.font-body{font-family:'Instrument Sans',system-ui,sans-serif}
@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes sun{0%,100%{box-shadow:0 0 0 0 rgba(255,200,87,.5)}50%{box-shadow:0 0 0 28px rgba(255,200,87,0)}}
.wave{animation:wave 9s linear infinite}
.wave2{animation:wave 14s linear infinite reverse}
.bob{animation:bob 5s ease-in-out infinite}
.marquee{animation:marquee 32s linear infinite}
.sunpulse{animation:sun 3s ease-out infinite}
.hero-in{opacity:0;animation:rise .9s cubic-bezier(.2,.7,.2,1) forwards}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.reveal.on{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .wave,.wave2,.bob,.marquee,.sunpulse,.hero-in{animation:none!important;opacity:1}
  .reveal{opacity:1;transform:none;transition:none}
}
`;

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setOn(true), io.disconnect()),
      { threshold: 0.15 }
    );
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${on ? "on" : ""} ${className}`}>
      {children}
    </div>
  );
}

const WavePath = ({ fill }) => (
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-8 w-[200%] block" aria-hidden>
    <path fill={fill} d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z" />
  </svg>
);

function TideScrubber() {
  const [hour, setHour] = useState(14);
  const level = 50 + 38 * Math.sin(((hour - 2) / 12.4) * 2 * Math.PI);
  const rising = Math.cos(((hour - 2) / 12.4) * 2 * Math.PI) > 0;
  const m = (level / 100) * 2.4;
  const fmt = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#F5FBF8] shadow-2xl shadow-[#0B2A3C]/40 ring-1 ring-white/20">
      <div className="relative h-72 sm:h-80 bg-gradient-to-b from-[#FFE7B0] to-[#F5FBF8]">
        <div className="sunpulse absolute right-8 top-8 h-14 w-14 rounded-full bg-[#FFC857]" />
        <div className="bob absolute left-10 top-24 text-4xl" aria-hidden>⛵</div>
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
          style={{ height: `${level}%` }}
        >
          <div className="absolute -top-7 left-0 w-full overflow-hidden">
            <div className="wave flex w-max"><WavePath fill="#2FA4A0" /></div>
          </div>
          <div className="absolute -top-4 left-0 w-full overflow-hidden opacity-70">
            <div className="wave2 flex w-max"><WavePath fill="#0B2A3C" /></div>
          </div>
          <div className="h-full bg-gradient-to-b from-[#2FA4A0] to-[#0B2A3C]" />
        </div>
        <div className="absolute left-5 top-5 rounded-full bg-[#0B2A3C]/90 px-3 py-1 text-xs font-semibold text-[#F5FBF8] backdrop-blur">
          {rising ? "Rising" : "Falling"} · {m.toFixed(1)} m
        </div>
      </div>
      <div className="px-6 pb-6 pt-4 font-body">
        <div className="mb-2 flex items-baseline justify-between text-[#0B2A3C]">
          <span className="text-sm font-medium">Drag to scrub the day</span>
          <span className="font-display text-2xl font-extrabold tabular-nums">{fmt(hour)}</span>
        </div>
        <input
          type="range" min="0" max="24" step="0.25" value={hour}
          onChange={(e) => setHour(+e.target.value)}
          aria-label="Hour of day"
          className="h-2 w-full cursor-pointer accent-[#FF6B5B]"
        />
      </div>
    </div>
  );
}

const features = [
  { t: "Tides to the minute", d: "Pick a beach and see exactly when the water is high, low, or on the move. No charts to decode.", span: "md:col-span-3", tone: "bg-[#0B2A3C] text-[#F5FBF8]", icon: "🌊" },
  { t: "Rip current alerts", d: "A buzz on your phone before the water turns against you.", span: "md:col-span-2", tone: "bg-[#FF6B5B] text-[#0B2A3C]", icon: "🚩" },
  { t: "Offline on the sand", d: "Saved beaches work with zero signal.", span: "md:col-span-2", tone: "bg-[#BFE8DC] text-[#0B2A3C]", icon: "📴" },
  { t: "Plan with friends", d: "Share one link and everyone sees the same window to swim, surf, or fish.", span: "md:col-span-3", tone: "bg-[#FFC857] text-[#0B2A3C]", icon: "🧺" },
];

const steps = [
  ["Choose your beach", "Search 4,000 coastlines or let Tidewise find the nearest."],
  ["Scrub the day", "Slide through the hours and watch the sea level change."],
  ["Get the nudge", "We alert you 30 minutes before the best window opens."],
];

const quotes = [
  "Finally a tide app that doesn't look like a spreadsheet.", "Caught the best morning swell all week.",
  "My kids check it before breakfast now.", "Saved our fishing trip twice.",
  "The offline mode actually works.", "Rip alert pulled us out in time.",
];

export default function App() {
  const [open, setOpen] = useState(false);
  const links = ["Features", "How it works", "Reviews"];
  return (
    <div className="font-body min-h-screen overflow-x-hidden bg-[#F5FBF8] text-[#0B2A3C] antialiased">
      <style>{css}</style>

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full bg-[#0B2A3C]/85 px-5 py-3 text-[#F5FBF8] backdrop-blur-md sm:mx-6 lg:mx-auto">
          <a href="#top" className="font-display text-xl font-extrabold tracking-tight">tidewise</a>
          <ul className="hidden items-center gap-8 text-sm md:flex">
            {links.map((l) => (
              <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="transition hover:text-[#FFC857]">{l}</a></li>
            ))}
          </ul>
          <a href="#get" className="hidden rounded-full bg-[#FFC857] px-5 py-2 text-sm font-semibold text-[#0B2A3C] transition hover:scale-105 md:block">Get the app</a>
          <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden">
            <span className={`h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </nav>
        <div className={`mx-4 mt-2 overflow-hidden rounded-3xl bg-[#0B2A3C] text-[#F5FBF8] transition-all duration-300 md:hidden ${open ? "max-h-72 p-5 opacity-100" : "max-h-0 p-0 opacity-0"}`}>
          {links.map((l) => (
            <a key={l} onClick={() => setOpen(false)} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="block py-2 text-lg">{l}</a>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative bg-[#0B2A3C] px-5 pb-28 pt-32 text-[#F5FBF8] sm:px-8 lg:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <h1 className="hero-in font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl" style={{ animationDelay: ".1s" }}>
              Know the sea before you get wet.
            </h1>
            <p className="hero-in mt-6 max-w-md text-lg leading-relaxed text-[#BFE8DC]" style={{ animationDelay: ".3s" }}>
              Tidewise shows tides, currents and the safest swim window for any beach, in plain language.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".5s" }}>
              <a href="#get" className="rounded-full bg-[#FF6B5B] px-7 py-3.5 font-semibold text-[#0B2A3C] transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6B5B]/30">Download free</a>
              <a href="#how-it-works" className="rounded-full px-7 py-3.5 font-semibold ring-1 ring-[#BFE8DC]/40 transition hover:bg-white/10">See how it works</a>
            </div>
          </div>
          <div className="hero-in" style={{ animationDelay: ".6s" }}><TideScrubber /></div>
        </div>
        <svg className="absolute inset-x-0 bottom-[-1px] w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path fill="#F5FBF8" d="M0 40 Q360 0 720 30 T1440 20 V60 H0Z" />
        </svg>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal><h2 className="font-display max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">Everything the shoreline is trying to tell you.</h2></Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 100} className={f.span}>
              <article className={`group h-full rounded-[2rem] p-8 transition duration-500 hover:-rotate-1 hover:scale-[1.02] ${f.tone}`}>
                <div className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{f.icon}</div>
                <h3 className="font-display mt-10 text-2xl font-bold">{f.t}</h3>
                <p className="mt-2 max-w-sm opacity-80">{f.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#BFE8DC] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal><h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Three taps from couch to coast.</h2></Reveal>
          <ol className="relative mt-14 space-y-10 border-l-2 border-dashed border-[#0B2A3C]/40 pl-8 sm:pl-12">
            {steps.map(([t, d], i) => (
              <Reveal key={t} delay={i * 120}>
                <li className="relative">
                  <span className="absolute -left-[2.9rem] top-1 h-5 w-5 rounded-full border-4 border-[#BFE8DC] bg-[#FF6B5B] sm:-left-[3.9rem]" />
                  <h3 className="font-display text-2xl font-bold">{t}</h3>
                  <p className="mt-1 max-w-lg text-[#0B2A3C]/75">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews marquee */}
      <section id="reviews" className="overflow-hidden py-24">
        <Reveal><h2 className="font-display mb-12 px-5 text-center text-4xl font-extrabold tracking-tight sm:text-5xl">Heard on the beach</h2></Reveal>
        <div className="flex w-max marquee hover:[animation-play-state:paused]">
          {[...quotes, ...quotes].map((q, i) => (
            <figure key={i} className={`mx-3 w-72 shrink-0 rounded-3xl p-6 sm:w-80 ${i % 3 === 0 ? "bg-[#FFC857]" : i % 3 === 1 ? "bg-[#0B2A3C] text-[#F5FBF8]" : "bg-[#BFE8DC]"}`}>
              <blockquote className="font-display text-lg font-semibold leading-snug">“{q}”</blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="get" className="px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#0B2A3C] px-6 py-20 text-center text-[#F5FBF8] sm:px-12">
            <div className="absolute inset-x-0 bottom-0 opacity-40"><div className="wave flex w-max"><WavePath fill="#2FA4A0" /></div></div>
            <h2 className="font-display relative text-4xl font-extrabold tracking-tight sm:text-5xl">The next high tide is coming. Be there.</h2>
            <form onSubmit={(e) => e.preventDefault()} className="relative mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="you@email.com" aria-label="Email" className="w-full rounded-full bg-white/10 px-6 py-3.5 text-[#F5FBF8] placeholder-[#BFE8DC]/60 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#FFC857]" />
              <button className="rounded-full bg-[#FFC857] px-7 py-3.5 font-semibold text-[#0B2A3C] transition hover:scale-105 active:scale-95">Send me the link</button>
            </form>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-[#0B2A3C]/10 px-5 py-8 text-center text-sm text-[#0B2A3C]/60">
        © {new Date().getFullYear()} Tidewise. Made for people who love the sea.
      </footer>
    </div>
  );
}
