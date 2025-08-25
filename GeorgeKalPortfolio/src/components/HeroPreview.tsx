import React, { useEffect, useMemo, useState } from "react";
import Button from "./button";
import MarketPanel from "./MarketPanel";

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
      className="min-h-screen text-white"
      // keep cursor unset so your custom cursor isn’t overridden
      
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <nav className="mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
          <a href="#" className="font-bold tracking-wide">GK</a>
          <ul className="hidden sm:flex gap-6 text-sm">
            <li><Button className="opacity-90 hover:opacity-100" href="#about">About</Button></li>
            <li><Button className="opacity-90 hover:opacity-100" href="#experience">Experience</Button></li>
            <li><Button className="opacity-90 hover:opacity-100" href="#projects">Projects</Button></li>
            <li><Button className="opacity-90 hover:opacity-100" href="#skills">Skills</Button></li>
            <li><Button className="opacity-90 hover:opacity-100" href="#contact">Contact</Button></li>
          </ul>
          <a
            href={resumeHref}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
          >
            Resume
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-28 pb-10 md:pb-16">
        <div className="grid md:grid-cols-5 gap-6 items-start">
          <div className="md:col-span-3">
            <p className="text-sm uppercase tracking-[.25em] text-white/70">{titleTagline}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              {/* inline gradient so we don't need a helper class */}
              {/* <span className="mr-2">George</span> */}
              
              <div>George</div>
              <span className=" white  ">
                {titleName.replace(/^George\\s+/i, "")}
              </span>
            </h1>
            <p className="mt-4 text-white/80 max-w-2xl">
              University of Waterloo student blending quantitative analysis with practical software.
              I build reliable tools and data-driven projects, always with performance, clarity, and accessibility in mind.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#projects" className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20">
                View Projects
              </Button>
              <Button href="#contact" className="px-5 py-3 rounded-full border border-white/20 hover:border-white/40">
                Get in touch
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <MarketPanel symbols={symbols} />
          </div>
        </div>
      </section>
    </div>
  );
}


