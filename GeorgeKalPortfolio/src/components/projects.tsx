import React from "react";

export default function GiantResumeSection() {
  const projects = [
    {
      title: "Investment Project",
      stack: ["Financial Analytics", "Excel"],
      complete: true,
      highlights: [
        "Achieved a time-weighted return (TWRR) 6.45 pp higher than the S&P 500 benchmark.",
        "Created portfolio of high-growth/potential stocks with balanced risk/growth ratio, with Sharpe ratio of 1.16.",
        "Delivered a 40.5% total ROI over two years through systematic analytics and re-balancing.",
      ],
    },
    {
      title: "NBA Match Outcome Predictor",
      stack: ["Python", "pandas", "scikit-learn"],
      complete: true,
      highlights: [
        "Trained on outcomes from 2002 → latest season (~28,000 games).",
        "Peak accuracy ≈ 82% with ROC > 0.9.",
        "Utilized Python programming language and libraries including, but not limited, to sklearn and pandas.",
      ],
    },
    {
      title: "Live Face Detection",
      stack: ["Python", "OpenCV"],
      complete: true,
      highlights: [
        "Real-time camera color detection with instant blur masking.",
      ],
    },
    {
      title: "DCF builder automation",
      stack: ["Python", "EdgarTools", "Pandas", "SEC API"],
      complete: false,
      highlights: [
        "Automated DCF model building with real SEC filings data.",
      ],
    },
  ];

  const projectStatusDecoration = [
    {
      complete: true,
      className: "text-green-500 border-1 border-green-700 inline-block p-[5px] rounded-[20px] mt-[10px]",
      label: "Completed",
    },
    {
      complete: false,
      className: "text-red-500 border-1 border-red-700  inline-block p-[5px] rounded-[20px] mt-[10px]",
      label: "In Progress",
    },
  ];

  return (
    <div>
      <h3 id="projects" className="mb-6 text-2xl font-semibold text-white">Projects</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((proj, i) => (
          <article
              key={i}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-[1px] shadow-sm backdrop-blur transition-transform duration-150 hover:-translate-y-1 hover:shadow-md"
            >
              {/* gradient border wrapper */}
              <div className="rounded-2xl bg-black/6 p-6 relative overflow-hidden">
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
                <div className={`text-xs ${projectStatusDecoration.find(dec => dec.complete === proj.complete)?.className}`}>
                  {projectStatusDecoration.find(dec => dec.complete === proj.complete)?.label}
                </div>
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
  );
}