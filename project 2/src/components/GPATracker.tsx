import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Target, BarChart3, Calendar, Star, Zap, BookOpen } from 'lucide-react';

interface GPAData {
  semester: string;
  gpa: number;
  cumulativeGpa: number;
  credits: number;
  courses: number;
}

const GPATracker: React.FC = () => {
  const [gpaData] = useState<GPAData[]>([
    { semester: 'Fall 2023', gpa: 3.4, cumulativeGpa: 3.4, credits: 15, courses: 5 },
    { semester: 'Spring 2024', gpa: 3.67, cumulativeGpa: 3.54, credits: 16, courses: 4 },
    { semester: 'Fall 2024', gpa: 3.8, cumulativeGpa: 3.64, credits: 17, courses: 5 },
    { semester: 'Spring 2025', gpa: 0, cumulativeGpa: 3.64, credits: 15, courses: 4 }, // Projected
  ]);

  const [targetGpa, setTargetGpa] = useState(3.75);
  const currentGpa = 3.64;
  const totalCredits = 48;

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return 'from-green-400 to-green-600';
    if (gpa >= 3.3) return 'from-blue-400 to-blue-600';
    if (gpa >= 3.0) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getGpaGlow = (gpa: number) => {
    if (gpa >= 3.7) return 'bg-green-400/20';
    if (gpa >= 3.3) return 'bg-blue-400/20';
    if (gpa >= 3.0) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <BarChart3 className="h-4 w-4 text-blue-400" />;
  };

  const calculateRequiredGpa = (targetGpa: number, currentGpa: number, completedCredits: number, newCredits: number) => {
    const totalCreditsNeeded = completedCredits + newCredits;
    const requiredGpa = (targetGpa * totalCreditsNeeded - currentGpa * completedCredits) / newCredits;
    return Math.max(0, Math.min(4.0, requiredGpa));
  };

  const requiredGpa = calculateRequiredGpa(targetGpa, currentGpa, totalCredits, 15);

  return (
    <div className="space-y-8">
      {/* GPA Overview with Enhanced Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current GPA', value: currentGpa.toFixed(2), icon: Award, color: getGpaColor(currentGpa), glow: getGpaGlow(currentGpa) },
          { label: 'Target GPA', value: targetGpa.toFixed(2), icon: Target, color: 'from-purple-400 to-purple-600', glow: 'bg-purple-400/20' },
          { label: 'Total Credits', value: totalCredits.toString(), icon: BarChart3, color: 'from-blue-400 to-blue-600', glow: 'bg-blue-400/20' },
          { label: 'Required Next GPA', value: requiredGpa.toFixed(2), icon: Zap, color: 'from-orange-400 to-orange-600', glow: 'bg-orange-400/20' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-stat-card p-6 group glass-shimmer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glass-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.glow} backdrop-blur-sm`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} 
                     style={{ width: `${(parseFloat(stat.value) / 4.0) * 100}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GPA Trend Chart with Glass Effect */}
      <div className="glass-card p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="glass-button p-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-glass">GPA Trend Analysis</h3>
        </div>
        
        <div className="relative h-80 mb-8">
          <div className="absolute inset-0 flex items-end justify-between space-x-4">
            {gpaData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full glass-course-card rounded-t-2xl relative mb-4 transition-all duration-500 hover:scale-105" 
                     style={{ height: '240px' }}>
                  <div 
                    className={`absolute bottom-0 w-full bg-gradient-to-t ${getGpaColor(data.cumulativeGpa)} rounded-t-2xl transition-all duration-1000 shadow-lg`}
                    style={{ 
                      height: `${(data.cumulativeGpa / 4.0) * 100}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-button px-2 py-1">
                    <span className="text-xs font-bold text-white">{data.cumulativeGpa.toFixed(2)}</span>
                  </div>
                  
                  {/* Floating data points */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="glass-course-card p-2 text-center">
                      <p className="text-xs text-glass-muted">Semester</p>
                      <p className="text-xs font-bold text-white">{data.gpa > 0 ? data.gpa.toFixed(2) : 'TBD'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-glass text-sm mb-1">{data.semester}</p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-glass-muted">
                    <span>{data.courses} courses</span>
                    <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                    <span>{data.credits} credits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Breakdown with Enhanced Cards */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="glass-button p-2">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-glass">Semester Breakdown</h3>
        </div>
        
        <div className="space-y-4">
          {gpaData.map((data, index) => (
            <div key={index} className="glass-course-card p-6 group glass-shimmer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-glass-muted" />
                    <span className="font-semibold text-glass text-lg">{data.semester}</span>
                    {index === gpaData.length - 1 && data.gpa === 0 && (
                      <div className="px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full">
                        Projected
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-glass-muted">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{data.courses} courses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{data.credits} credits</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-sm text-glass-muted mb-1">Semester GPA</p>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getGpaColor(data.gpa)} text-white font-bold`}>
                      {data.gpa > 0 ? data.gpa.toFixed(2) : 'TBD'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-glass-muted mb-1">Cumulative GPA</p>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getGpaColor(data.cumulativeGpa)} text-white font-bold`}>
                        {data.cumulativeGpa.toFixed(2)}
                      </div>
                      {index > 0 && getTrendIcon(data.cumulativeGpa, gpaData[index - 1].cumulativeGpa)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPA Calculator with Glass Inputs */}
      <div className="glass-card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="glass-button p-2">
            <Target className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-glass">GPA Goal Calculator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-sm font-medium text-glass-muted mb-3">
              Target GPA
            </label>
            <input
              type="number"
              min="0"
              max="4.0"
              step="0.01"
              value={targetGpa}
              onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
              className="glass-input w-full px-4 py-3 text-white placeholder-glass-subtle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-glass-muted mb-3">
              Credits Next Semester
            </label>
            <input
              type="number"
              min="1"
              max="20"
              defaultValue={15}
              className="glass-input w-full px-4 py-3 text-white placeholder-glass-subtle"
            />
          </div>
        </div>
        
        <div className="glass-course-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h4 className="font-semibold text-glass">Goal Analysis</h4>
          </div>
          <p className="text-glass-muted leading-relaxed">
            To achieve your target GPA of <span className="font-bold gradient-text-accent">{targetGpa.toFixed(2)}</span>, 
            you need to earn at least a <span className="font-bold gradient-text-accent">
              {requiredGpa.toFixed(2)}
            </span> GPA next semester with 15 credits.
          </p>
          
          {requiredGpa > 4.0 && (
            <div className="mt-4 p-4 bg-red-400/20 border border-red-400/30 rounded-lg">
              <p className="text-red-300 text-sm">
                ⚠️ Your target GPA may not be achievable with the current credit load. Consider taking more credits or adjusting your target.
              </p>
            </div>
          )}
          
          {requiredGpa <= 4.0 && requiredGpa >= 3.7 && (
            <div className="mt-4 p-4 bg-green-400/20 border border-green-400/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✨ Excellent goal! This target is achievable with strong performance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPATracker;