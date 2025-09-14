import React, { useEffect, useMemo, useState } from "react";
import Button from "./button";
import MarketPanel from "./MarketPanel";
import LetterReveal from "./LetterReveal";

/**
 * FinanceHeroPreview
 * - Props:
 *    - apiKey?: string             // Twelve Data API key; falls back to VITE_TWELVE_API_KEY
 *    - symbols?: string[]          // tickers to show (default top US mega-caps)
 *    - resumeHref?: string         // href for the Resume button
 *    - titleName?: string          // your name in the H1
 *    - titleTagline?: string       // the small line above the H1
 *
 * Example:
 * <FinanceHeroPreview apiKey="YOUR_KEY" symbols={['AAPL','MSFT']} resumeHref="/resume.pdf" />
 */
export default function FinanceHeroPreview({
  symbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"],
  resumeHref = "/resume.pdf",
  titleName = " Kalashlinskyi",
  titleTagline = "Mathematical Finance",
}) {


  return (
    <div
      className="min-h-screen text-white grid content-around"
      // keep cursor unset so your custom cursor isn’t overridden
      
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 ">
          <a href="#" className="font-bold tracking-wide"><Button>GK</Button></a>
          <ul className="hidden sm:flex gap-6 text-sm">
            <li><a className="px-4 py-2 rounded opacity-90 hover:opacity-100 cursor-none no-cursor-enlarge" href="#about"><Button>About</Button></a></li>
            <li><a className="px-4 py-2 rounded opacity-90 hover:opacity-100 cursor-none no-cursor-enlarge" href="#experience"><Button>Experience</Button></a></li>
            <li><a className="px-4 py-2 rounded opacity-90 hover:opacity-100 cursor-none no-cursor-enlarge" href="#projects"><Button>Projects</Button></a></li>
            <li><a className="px-4 py-2 rounded opacity-90 hover:opacity-100 cursor-none no-cursor-enlarge" href="#skills"><Button>Skills</Button></a></li>
            <li><a className="px-4 py-2 rounded opacity-90 hover:opacity-100 cursor-none no-cursor-enlarge" href="#contact"><Button>Contact</Button></a></li>
          </ul>
          <a
            href={resumeHref}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg cursor-none"
          >
            Resume
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mt-[100px] mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-28 pb-10 md:pb-16">
        <div className="grid md:grid-cols-5 gap-6 items-start">
          <div className="md:col-span-3">
            <p className="text-sm uppercase tracking-[.25em] text-white/70"><LetterReveal text={titleTagline} className="text-white/70 uppercase tracking-[.25em] text-sm" charClass="inline-block" maxDelay={400} duration={300} /></p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              <div className="sr-only">{`George ${titleName.replace(/^George\s+/i, "")}`}</div>
              <div>
                <LetterReveal text={`George ${titleName.replace(/^George\s+/i, "")}`} className="text-white" charClass="inline-block" maxDelay={700} duration={300} />
              </div>
            </h1>
            <p className="mt-4 text-white/80 max-w-2xl"><LetterReveal text={"University of Waterloo student blending quantitative analysis with practical software. I build reliable tools and data-driven projects, always with performance, clarity, and accessibility in mind."} className="text-white/80" charClass="inline-block" maxDelay={700} duration={300} /></p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#projects" className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 cursor-none">
                View Projects
              </a>
              <a href="#contact" className="px-5 py-3 rounded-full border border-white/20 hover:border-white/40 cursor-none">
                Get in touch
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <MarketPanel symbols={symbols} />
          </div>
        </div>
      </section>
      <div className="inset-x-0 bottom-[1%] flex justify-center mt-8">
        <a href="#experience" className="text-[50px] text-white/70 hover:text-white/90 animate-bounce cursor-none" aria-label="Scroll down to Projects section">
          &#8964;
        </a>
      </div>
    </div>
  );
}


