import { useEffect, useState } from "react";
import Projects from "./projects";
/**
 * GiantResumeSection (v2)
 * - Experience first, then Projects directly underneath.
 * - Subtle decorations: gradient glow, glass cards, timeline dots, hover lift.
 * - Self-contained, Tailwind-only. Safe to mount right after <HeroPreview />.
 */

type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  tags: string[];
  logoSrc?: string;
  logoAlt?: string;
};

type Education = {
  school: string;
  degree: string;
  location: string;
  period: string;
  details: string;
};

type SkillGroup = {
  category: string;
  items: string[];
};

type ResumeSectionContent = {
  badge: string;
  title: string;
  accentTitle: string;
  description: string;
  education: Education[];
  experiences: Experience[];
  skills: SkillGroup[];
};

const fallbackResumeContent: ResumeSectionContent = {
  badge: "Resume Highlights",
  title: "Resume",
  accentTitle: " Highlights",
  description: "My education, experience, selected projects, and analytical toolkit.",
  education: [
    {
      school: "University of Waterloo",
      degree: "BMath, Mathematical Finance",
      location: "Waterloo, ON",
      period: "Expected 2028",
      details: "Relevant coursework: macroeconomics, microeconomics, OOP and design patterns, financial mathematics, calculus, and linear algebra I/II.",
    },
  ],
  experiences: [
    {
      role: "Global Hedging ALM, Actuarial Intern (Incoming)",
      company: "Manulife",
      location: "Toronto, ON",
      period: "Sep 2026 – Dec 2026",
      logoSrc: "/logos/manulife.png",
      logoAlt: "Manulife logo",
      points: [
        "Selected to support Manulife’s global hedging programs for variable annuity and index-linked products across equity, interest-rate, currency, and fixed-income risk factors.",
        "Will perform daily exposure mapping and produce aggregate risk reports identifying key portfolio risk drivers and informing internal hedging decisions.",
        "Will analyze Bloomberg and Reuters market data and maintain fund and security classifications through corporate actions and market changes, strengthening downstream exposure reporting accuracy.",
      ],
      tags: ["ALM", "Global Hedging", "Risk Reporting", "Bloomberg", "Reuters"],
    },
    {
      role: "Business Technology Analyst Intern, Solutions Architecture",
      company: "Manulife",
      location: "Toronto, ON",
      period: "May 2026 – Aug 2026",
      logoSrc: "/logos/manulife.png",
      logoAlt: "Manulife logo",
      points: [
        "Analyzed business processes, system dependencies, technical risks, and implementation constraints to support enterprise technology initiatives.",
        "Worked with senior architects and engineers to design an AI-enabled regulatory report filing solution projected to improve processing efficiency by up to 80%.",
        "Partnered with business stakeholders, architecture, and delivery teams to clarify requirements, document decisions, track dependencies, and support solution planning.",
        "Created process flows, implementation notes, technical summaries, and architecture documentation using Python, Lucidchart, Confluence, Generative AI, and Rovo AI.",
      ],
      tags: ["Solutions Architecture", "Python", "Lucidchart", "Confluence", "Generative AI"],
    },
    {
      role: "Software Developer Intern",
      company: "Otomakeit Solutions",
      location: "Remote",
      period: "Sep 2024 – Dec 2024",
      logoSrc: "",
      logoAlt: "Otomakeit Solutions logo",
      points: [
        "Developed and maintained Python-based automation tools to streamline repetitive internal workflows and improve operational efficiency.",
        "Debugged, tested, and refactored existing Python code to improve reliability, readability, and maintainability across application components.",
        "Integrated external APIs to retrieve and process structured data, handling authentication, request logic, error cases, and data formatting for downstream use.",
      ],
      tags: ["Python", "Automation", "APIs", "Testing", "Data Processing"],
    },
  ],
  skills: [
    { category: "Data Analysis", items: ["SQL", "Python", "pandas", "Excel", "Data Cleaning", "Data Manipulation", "Exploratory Analysis", "Segmentation", "Regression", "Cohort Analysis", "Funnel Analysis"] },
    { category: "Visualization & Reporting", items: ["Excel Dashboards", "PowerPoint", "Reporting Templates", "Business Performance Summaries", "Stakeholder Insights", "KPI Tracking"] },
    { category: "Analytics Engineering", items: ["Structured Datasets", "API Data Retrieval", "Automated Workflows", "Data Quality Checks", "Reproducible Analysis", "Documentation", "Operational Data"] },
    { category: "Professional", items: ["Ownership", "Curiosity", "Ambiguity Management", "Stakeholder Communication", "Independent Execution", "Mentorship", "Problem Solving", "Fast Learning"] },
    { category: "Certifications", items: ["Bloomberg Market Concepts (BMC)", "Investment Evaluation"] },
  ],
};

export default function GiantResumeSection() {
  const [resumeContent, setResumeContent] = useState<ResumeSectionContent>(fallbackResumeContent);

  useEffect(() => {
    let isMounted = true;

    const loadResumeContent = async () => {
      try {
        const response = await fetch("/resume-data.json");

        if (!response.ok) {
          throw new Error(`Failed to load resume data: ${response.status}`);
        }

        const data = (await response.json()) as ResumeSectionContent;

        if (isMounted) {
          setResumeContent(data);
        }
      } catch (error) {
        console.error("Using fallback resume content.", error);
      }
    };

    loadResumeContent();

    return () => {
      isMounted = false;
    };
  }, []);


  // Simple inline SVG icon (no extra deps)
  const Dot = (props: { className?: string }) => (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={props.className}>
      <circle cx="10" cy="10" r="6" />
    </svg>
  );

  return (
    <section
      id="resume"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      aria-label="Resume highlights"
    >

      {/* Header */}
      <header className="mb-14 text-center">
        <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/80 backdrop-blur">
          {resumeContent.badge}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {resumeContent.title}
          <span className="bg-gradient-to-r bg-clip-text text-green-500">{resumeContent.accentTitle}</span>
        </h2>
        <p className="mt-3 text-base text-white/80">
          {resumeContent.description}
        </p>
      </header>

      {/* EDUCATION */}
      <div className="mb-16">
        <h3 className="mb-6 text-2xl font-semibold text-white">Education</h3>
        <div className="grid gap-6">
          {resumeContent.education.map((item) => (
            <article
              key={`${item.school}-${item.degree}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/6 p-6 shadow-lg ring-1 ring-indigo-400/8 backdrop-blur-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent mix-blend-overlay" />
              <div className="relative flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">{item.school}</h4>
                  <p className="mt-1 text-green-400">{item.degree}</p>
                </div>
                <p className="text-sm text-white/70 sm:text-right">
                  {item.location}<br />{item.period}
                </p>
              </div>
              <p className="relative mt-4 text-sm leading-relaxed text-white/80">{item.details}</p>
            </article>
          ))}
        </div>
      </div>

      {/* EXPERIENCE (timeline) */}
      <div id="experience" className="relative mb-16 scroll-mt-28">
        <h3 className="mb-6 text-2xl font-semibold text-white">Experience</h3>
        <ol className="relative border-l-2 border-neutral-700">
          {resumeContent.experiences.map((exp, i) => (
            <li key={i} className="mb-12 ml-6 relative">
              {/* Timeline node */}
              <span className="absolute -left-11 top-3 ml-[-3.2px]">
                <span className="relative inline-flex h-11 w-11 items-center justify-center">
                  {/* Indigo pulse behind the glass */}


                  {/* Translucent sheen layer */}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/8 via-black/4 to-transparent pointer-events-none backdrop-blur-md" />

                  {/* Glass core */}
                  <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/8 bg-white/6 ring-1 ring-gray-200/40 backdrop-blur-sm shadow-inner">
                    {/* glossy highlight */}
                    <span className="absolute -top-1 left-1 h-2 w-3 rounded-full bg-white/30 blur-sm opacity-90" />
                    {/* company logo or fallback dot */}
                    {exp.logoSrc ? (
                      <img
                        src={exp.logoSrc}
                        alt={exp.logoAlt ?? `${exp.company} logo`}
                        className="relative z-10 h-7 w-7 rounded-full object-contain"
                      />
                    ) : (
                      <Dot className="relative z-10 h-3 w-3 fill-white drop-shadow-sm"/>
                    )}
                  </span>
                </span>
              </span>

              {/* Card */}
              <div className="group relative ml-2.5 rounded-2xl border border-white/10 bg-black/6 p-6 shadow-lg backdrop-blur-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl ring-1 ring-indigo-400/8 overflow-hidden">
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
                        className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-medium text-white/80">
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
        {/* <div className="pointer-events-none absolute inset-x-0 -top-3 mx-auto h-6 w-6 rounded-full bg-white/80 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900/80 dark:ring-neutral-800" /> */}
      </div>

      <Projects/>

      {/* SKILLS */}
      <div id="skills" className="mt-16 scroll-mt-28">
        <h3 className="mb-6 text-2xl font-semibold text-white">Skills & Certifications</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {resumeContent.skills.map((group) => (
            <article
              key={group.category}
              className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-sm backdrop-blur"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent mix-blend-overlay" />
              <h4 className="relative text-base font-semibold text-green-400">{group.category}</h4>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-medium text-white/80"
                  >
                    {item}
                  </span>
                ))}
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
