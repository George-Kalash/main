import React from "react";

/**
 * GiantResumeSection (v2)
 * - Experience first, then Projects directly underneath.
 * - Subtle decorations: gradient glow, glass cards, timeline dots, hover lift.
 * - Self-contained, Tailwind-only. Safe to mount right after <HeroPreview />.
 */
export default function GiantResumeSection() {
  // ====== DATA (from your resume) ======
  const experiences = [
    {
      role: "Math Instructor",
      company: "Mathnasium",
      location: "Kitchener, ON",
      period: "Aug 2024 – Present",
      points: [
        "Led group and 1:1 lessons in a fast-paced environment.",
        "Tracked and analyzed student performance to adapt instruction.",
        "Collaborated in a team-teaching environment to meet diverse needs.",
        "Engaged students up to Senior Calculus & Geometry.",
        "Delivered personalized instruction with the Mathnasium Method.",
      ],
      tags: ["Education", "Pedagogy", "Assessment"],
    },
    {
      role: "Software Developer Intern",
      company: "Otomakeit Solutions",
      location: "Halifax, ON",
      period: "Sep 2024 – Dec 2024",
      points: [
        "Built a C# Windows app to streamline internal file management with lightweight automation.",
        "Contributed to code reviews; improved code quality metrics.",
        "Fixed critical bugs using Visual Studio debugger; wrote technical docs and user guides.",
        "Added GitHub OAuth to fetch/visualize usage data and identify high-frequency actions.",
        "Explored AI-powered text classification for better tagging and search.",
      ],
      tags: ["C#", "Windows", "GitHub OAuth", "Docs", "Debugging"],
    },
  ];

  const projects = [
    {
      title: "Investment Project",
      stack: ["Financial Analytics", "Excel"],
      highlights: [
        "Built a growth-tilted portfolio balancing risk and return.",
        "Outperformed the S&P 500 in 2024 by ~6.42%.",
        "Achieved ~54% ROI over two years.",
      ],
    },
    {
      title: "NBA Match Outcome Predictor",
      stack: ["Python", "pandas", "scikit-learn"],
      highlights: [
        "Trained on outcomes from 2002 → latest season (~28,000 games).",
        "Peak accuracy ≈ 82% with ROC > 0.9.",
      ],
    },
    {
      title: "Live Face Detection",
      stack: ["Python", "OpenCV"],
      highlights: [
        "Real-time camera face detection with instant blur masking.",
      ],
    },
  ];

  // Simple inline SVG icon (no extra deps)
  const Dot = (props: { className?: string }) => (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={props.className}>
      <circle cx="10" cy="10" r="6" />
    </svg>
  );

  return (
    <section
      id="experience"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      aria-label="Experience and Projects"
    >

      {/* Header */}
      <header className="mb-14 text-center">
        <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/80 backdrop-blur">
          Resume Highlights
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">
          Experience
          <span className="bg-gradient-to-r bg-clip-text text-transparent"> &amp; Projects</span>
        </h2>
        <p className="mt-3 text-base text-white/80">
          A quick tour through where I’ve worked — followed by what I’ve built.
        </p>
      </header>

      {/* EXPERIENCE (timeline) */}
      <div className="relative mb-16">
        <ol className="relative border-l-2 border-neutral-700">
          {experiences.map((exp, i) => (
            <li key={i} className="mb-12 ml-6 relative">
              {/* Timeline node */}
              <span className="absolute -left-11 top-3">
                <span className="relative inline-flex h-9 w-9 items-center justify-center">
                  {/* Indigo pulse behind the glass */}
                  <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-indigo-500/20" />

                  {/* Translucent sheen layer */}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/8 via-black/4 to-transparent pointer-events-none backdrop-blur-md" />

                  {/* Glass core */}
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/6 border border-white/8 ring-1 ring-indigo-400/20 backdrop-blur-sm shadow-inner">
                    {/* glossy highlight */}
                    <span className="absolute -top-1 left-1 h-2 w-3 rounded-full bg-white/30 blur-sm opacity-90" />
                    {/* indigo accent dot */}
                    <Dot className="h-3 w-3 fill-indigo-400 drop-shadow-sm" />
                  </span>
                </span>
              </span>

              {/* Card */}
              <div className="group relative rounded-2xl border border-white/10 bg-white/6 p-6 shadow-lg backdrop-blur-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl ring-1 ring-indigo-400/8 overflow-hidden">
                {/* sheen */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent mix-blend-overlay" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">
                      {exp.role} <span className="text-white/70">— {exp.company}</span>
                    </h3>
                    <p className="text-sm text-white/70">
                      {exp.location} · {exp.period}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-medium text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                  {exp.points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* SECTION DIVIDER */}
      <div className="relative my-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
        <div className="pointer-events-none absolute inset-x-0 -top-3 mx-auto h-6 w-6 rounded-full bg-white/80 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900/80 dark:ring-neutral-800" />
      </div>

      {/* PROJECTS (directly under Experience) */}
      <div>
        <h3 id="projects" className="mb-6 text-2xl font-semibold text-white">Projects</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((proj, i) => (
            <article
              key={i}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-[1px] shadow-sm backdrop-blur transition-transform duration-150 hover:-translate-y-1 hover:shadow-md"
            >
              {/* gradient border wrapper */}
              <div className="rounded-2xl bg-white/6 p-6 relative overflow-hidden">
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent mix-blend-overlay" />
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-lg font-semibold text-white">{proj.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {proj.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-1 text-xs font-medium text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </header>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                  {proj.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer hairline */}
      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
    </section>
  );
}
