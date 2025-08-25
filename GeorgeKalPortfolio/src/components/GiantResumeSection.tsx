import React from "react";

/**
 * GiantResumeSection
 * Big, self-contained section that lists Experience and Projects from your resume.
 * Tailwind-only (no extra deps), responsive, and safe to drop in after <HeroPreview />.
 */
export default function GiantResumeSection() {
  const experiences = [
    {
      role: "Math Instructor",
      company: "Mathnasium",
      location: "Kitchener, ON",
      period: "Aug 2024 – Present",
      points: [
        "Led group and 1:1 lessons; tracked and analyzed student performance to adapt instruction.",
        "Collaborated in a team-teaching environment; covered topics up to Senior Calculus & Geometry.",
        "Delivered personalized instruction with the Mathnasium Method to boost understanding and confidence.",
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
        "Contributed to code reviews with a senior dev; improved code quality metrics by ~15%.",
        "Fixed critical bugs using Visual Studio debugger; authored technical docs and user guides.",
        "Implemented GitHub OAuth to fetch/visualize usage data and identify high-frequency actions.",
        "Explored AI-powered text classification for better internal tagging and search.",
      ],
      tags: ["C#", "Windows", "GitHub OAuth", "Docs", "Debugging"],
    },
  ];

  const projects = [
    {
      title: "Investment Project",
      stack: ["Financial analytics", "Excel"],
      highlights: [
        "Built a portfolio of high-growth/potential stocks with balanced risk/growth.",
        "Outperformed the S&P 500 in 2024 by 6.42%.",
        "Achieved ~54% ROI over two years.",
      ],
    },
    {
      title: "NBA Match Outcome Predictor",
      stack: ["Python", "pandas", "scikit-learn"],
      highlights: [
        "Trained on results from 2002 → latest season (~28,000 games).",
        "Recorded peak accuracy ≈ 82% with ROC > 0.9.",
      ],
    },
    {
      title: "Live Face Detection",
      stack: ["Python", "OpenCV"],
      highlights: [
        "Live camera face detection with real-time blur to mask faces on screen.",
      ],
    },
  ];

  return (
    <section
      id="experience-projects"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      aria-label="Experience and Projects"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-64 w-[120vw] -translate-x-1/2 bg-gradient-to-b from-white/0 via-white/20 to-white/0 blur-3xl dark:from-white/0 dark:via-white/5 dark:to-white/0" />
      </div>

      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Experience & Projects
        </h2>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-300">
          A concise snapshot of what I’ve built and where I’ve worked.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* EXPERIENCE */}
        <div>
          <h3 className="mb-6 text-2xl font-semibold">Experience</h3>
          <ol className="relative border-s border-neutral-200 dark:border-neutral-800">
            {experiences.map((exp, i) => (
              <li key={i} className="mb-10 ms-6">
                <span className="absolute -start-3 mt-2 h-6 w-6 rounded-full bg-neutral-200 ring-8 ring-white dark:bg-neutral-700 dark:ring-neutral-900" />
                <div className="rounded-2xl border border-neutral-200/60 bg-white/60 p-6 backdrop-blur-lg shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="truncate text-lg font-semibold">
                        {exp.role} <span className="text-neutral-500">— {exp.company}</span>
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {exp.location} · {exp.period}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                    {exp.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* PROJECTS */}
        <div>
          <h3 className="mb-6 text-2xl font-semibold">Projects</h3>

          <div className="grid gap-6">
            {projects.map((proj, i) => (
              <article
                key={i}
                className="rounded-2xl border border-neutral-200/60 bg-white/60 p-6 backdrop-blur-lg shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-lg font-semibold">{proj.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {proj.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </header>

                <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                  {proj.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle footer divider */}
      <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
    </section>
  );
}
