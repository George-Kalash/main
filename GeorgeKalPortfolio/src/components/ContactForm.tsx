import React from "react";

export default function ContactForm() {

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      aria-label="Contact"
    >
      {/* Header */}
      <header className="mb-14 text-center">
        <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/80 backdrop-blur">
          Contact
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">
          Connect <span className="bg-gradient-to-r bg-clip-text text-green-500">With Me</span>
        </h2>
        <p className="mt-3 text-base text-white/80">
          Connect with me on social media and explore my work.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Combined Contact Info and Social Links */}
        <div className="group relative rounded-2xl border border-white/10 bg-black/6 p-8 shadow-lg backdrop-blur-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl ring-1 ring-indigo-400/8 overflow-hidden">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent mix-blend-overlay" />
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Contact Information</h3>

          {/* Contact Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80">Email</p>
                <a className="text-white hover:text-green-400" href="mailto:hkalashl@uwaterloo.ca">hkalashl@uwaterloo.ca</a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80">Phone</p>
                <a className="text-white hover:text-green-400" href="tel:+12507022460">250-702-2460</a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80">Location</p>
                <p className="text-white">Waterloo, ON, Canada</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-medium text-white mb-4 text-center">Connect With Me</h4>
            <div className="flex justify-center space-x-8">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/george-kalash"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-none group/icon relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <svg className="cursor-none w-6 h-6 text-white group-hover/icon:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/george-kalash"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-none group/icon relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <svg className="cursor-none w-6 h-6 text-white group-hover/icon:text-gray-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              {/* Medium */}
              <a
                href="https://medium.com/@georgekalash"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-none group/icon relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
                aria-label="Medium Profile"
              >
                <svg className="cursor-none w-6 h-6 text-white group-hover/icon:text-green-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
