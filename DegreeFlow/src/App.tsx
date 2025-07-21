import React, { useState } from 'react';
import { GraduationCap, Calendar, TrendingUp, BookOpen, Sparkles } from 'lucide-react';
import MainDashboard from './components/MainDashboard';
import SemesterView from './components/SemesterView';
import GPATracker from './components/GPATracker';
import CalendarView from './components/CalendarView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'semesters', label: 'Semesters', icon: BookOpen },
    { id: 'gpa', label: 'GPA Tracker', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'semesters':
        return <SemesterView />;
      case 'gpa':
        return <GPATracker />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* SVG Mask Definitions */}
      <svg className="glass-svg-defs" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle glass mask for cards */}
          <mask id="glass-mask-subtle">
            <rect width="100%" height="100%" fill="white"/>
            <circle cx="20%" cy="20%" r="15%" fill="black" opacity="0.1"/>
            <circle cx="80%" cy="80%" r="10%" fill="black" opacity="0.05"/>
          </mask>
          
          {/* Edge highlight mask */}
          <mask id="glass-edge-mask">
            <rect width="100%" height="100%" fill="black"/>
            <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" fill="white" rx="18"/>
          </mask>
          
          {/* Header highlight mask */}
          <mask id="glass-highlight-mask">
            <rect width="100%" height="100%" fill="white"/>
            <ellipse cx="50%" cy="0%" rx="60%" ry="50%" fill="black" opacity="0.3"/>
          </mask>
          
          {/* Navigation mask */}
          <mask id="glass-nav-mask">
            <rect width="100%" height="100%" fill="white"/>
            <ellipse cx="50%" cy="0%" rx="80%" ry="100%" fill="black" opacity="0.2"/>
          </mask>
          
          {/* Button interaction mask */}
          <mask id="glass-button-mask">
            <rect width="100%" height="100%" fill="white"/>
            <ellipse cx="30%" cy="30%" rx="40%" ry="40%" fill="black" opacity="0.1"/>
          </mask>
          
          {/* Input field mask */}
          <mask id="glass-input-mask">
            <rect width="100%" height="100%" fill="white"/>
            <rect x="0" y="50%" width="100%" height="50%" fill="black" opacity="0.3"/>
          </mask>
          
          {/* Stat card radial mask */}
          <mask id="glass-stat-mask">
            <rect width="100%" height="100%" fill="white"/>
            <circle cx="20%" cy="20%" r="25%" fill="black" opacity="0.15"/>
          </mask>
          
          {/* Course card diagonal mask */}
          <mask id="glass-course-mask">
            <rect width="100%" height="100%" fill="white"/>
            <polygon points="0,0 50%,0 0,50%" fill="black" opacity="0.1"/>
            <polygon points="100%,100% 50%,100% 100%,50%" fill="black" opacity="0.05"/>
          </mask>
          
          {/* Calendar day mask */}
          <mask id="glass-calendar-mask">
            <rect width="100%" height="100%" fill="white"/>
            <polygon points="0,0 100%,0 0,100%" fill="black" opacity="0.08"/>
          </mask>
          
          {/* Today highlight mask */}
          <mask id="glass-today-mask">
            <rect width="100%" height="100%" fill="white"/>
            <circle cx="30%" cy="30%" r="40%" fill="black" opacity="0.2"/>
          </mask>
          
          {/* Shimmer effect mask */}
          <mask id="glass-shimmer-mask">
            <rect width="100%" height="100%" fill="white"/>
            <rect x="40%" y="0" width="20%" height="100%" fill="black" opacity="0.3"/>
          </mask>
          
          {/* Reflection mask */}
          <mask id="glass-reflection-mask">
            <rect width="100%" height="100%" fill="white"/>
            <polygon points="0,0 60%,0 0,60%" fill="black" opacity="0.2"/>
          </mask>
          
          {/* Advanced noise pattern for texture */}
          <filter id="glass-noise">
            <feTurbulence baseFrequency="0.9" numOctaves="3" result="noise"/>
            <feColorMatrix in="noise" type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0.02 0.04 0.06"/>
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic"/>
          </filter>
          
          {/* Frosted glass distortion */}
          <filter id="glass-frost">
            <feTurbulence baseFrequency="0.04" numOctaves="2" result="turbulence"/>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2"/>
          </filter>
        </defs>
      </svg>
      
      <div className="max-w-7xl mx-auto">
        {/* Liquid Glass Header */}
        <header className="glass-header border-b border-white/10 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="glass-button p-3">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-blue-300 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">UniTracker</h1>
                  <p className="text-sm text-glass-muted">Academic Excellence Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-glass-muted">Current GPA</p>
                  <p className="text-3xl font-bold gradient-text-accent">3.75</p>
                </div>
                <div className="glass-stat-card p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-glass-muted">Active Session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Liquid Glass Navigation */}
        <nav className="glass-nav border-b border-white/5 sticky top-[88px] z-40">
          <div className="px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm transition-all duration-300 relative overflow-hidden group ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-glass-muted hover:text-white'
                    }`}
                  >
                    {/* Active indicator */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    
                    <Icon className={`h-4 w-4 relative z-10 transition-transform duration-300 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content with Glass Background */}
        <main className="p-6 min-h-screen">
          <div className="glass-float">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}

export default App;