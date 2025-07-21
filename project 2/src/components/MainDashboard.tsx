import React from 'react';
import { BookOpen, Calendar, TrendingUp, Clock, Award, AlertCircle, Star, Zap } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const stats = [
    { label: 'Current GPA', value: '3.75', icon: TrendingUp, color: 'from-blue-400 to-blue-600', bgGlow: 'bg-blue-400/20' },
    { label: 'Credits Completed', value: '84', icon: Award, color: 'from-green-400 to-green-600', bgGlow: 'bg-green-400/20' },
    { label: 'Active Courses', value: '5', icon: BookOpen, color: 'from-purple-400 to-purple-600', bgGlow: 'bg-purple-400/20' },
    { label: 'Upcoming Deadlines', value: '3', icon: Clock, color: 'from-orange-400 to-orange-600', bgGlow: 'bg-orange-400/20' },
  ];

  const recentCourses = [
    { code: 'CS 301', name: 'Data Structures', grade: 'A-', credits: 3, professor: 'Dr. Smith', color: 'from-emerald-400 to-emerald-600' },
    { code: 'MATH 250', name: 'Calculus II', grade: 'B+', credits: 4, professor: 'Dr. Johnson', color: 'from-blue-400 to-blue-600' },
    { code: 'ENG 202', name: 'Technical Writing', grade: 'A', credits: 3, professor: 'Prof. Davis', color: 'from-green-400 to-green-600' },
  ];

  const upcomingDeadlines = [
    { course: 'CS 301', assignment: 'Project 2', dueDate: '2024-12-20', type: 'project', priority: 'high' },
    { course: 'MATH 250', assignment: 'Final Exam', dueDate: '2024-12-22', type: 'exam', priority: 'high' },
    { course: 'ENG 202', assignment: 'Research Paper', dueDate: '2024-12-18', type: 'paper', priority: 'medium' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'from-green-400 to-green-600';
    if (grade.startsWith('B')) return 'from-blue-400 to-blue-600';
    if (grade.startsWith('C')) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="h-3 w-3 text-red-400" />;
      case 'medium': return <Star className="h-3 w-3 text-yellow-400" />;
      default: return <Clock className="h-3 w-3 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid with Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-stat-card p-6 glass-shimmer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glass-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgGlow} backdrop-blur-sm`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} 
                     style={{ width: `${75 + index * 5}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses with Enhanced Glass Effect */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="glass-button p-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-glass">Recent Courses</h3>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <div key={index} className="glass-course-card p-4 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-glass">{course.code}</span>
                      <span className="text-glass-muted">•</span>
                      <span className="text-sm text-glass-muted">{course.credits} credits</span>
                    </div>
                    <p className="text-glass-muted mb-1">{course.name}</p>
                    <p className="text-xs text-glass-subtle">{course.professor}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getGradeColor(course.grade)} text-white`}>
                      {course.grade}
                    </div>
                    <div className={`w-12 h-1 bg-gradient-to-r ${course.color} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines with Priority Indicators */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="glass-button p-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-glass">Upcoming Deadlines</h3>
            </div>
            <div className="glass-button px-3 py-1">
              <span className="text-xs text-glass-muted">Next 7 days</span>
            </div>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="glass-course-card p-4 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-glass">{deadline.course}</span>
                      {getPriorityIcon(deadline.priority)}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deadline.type === 'exam' ? 'bg-red-400/20 text-red-300' :
                        deadline.type === 'project' ? 'bg-purple-400/20 text-purple-300' :
                        'bg-blue-400/20 text-blue-300'
                      }`}>
                        {deadline.type}
                      </div>
                    </div>
                    <p className="text-glass-muted">{deadline.assignment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-glass">{new Date(deadline.dueDate).toLocaleDateString()}</p>
                    <p className="text-xs text-glass-subtle">
                      {Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview with Animated Rings */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-semibold text-glass mb-8 text-center">Academic Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Degree Progress', percentage: 75, color: 'stroke-blue-400', bgColor: 'stroke-blue-400/20' },
            { label: 'Core Requirements', percentage: 80, color: 'stroke-green-400', bgColor: 'stroke-green-400/20' },
            { label: 'Electives', percentage: 50, color: 'stroke-purple-400', bgColor: 'stroke-purple-400/20' }
          ].map((item, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-24 h-24 transform -rotate-90 glass-progress-ring">
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    className={`${item.bgColor} fill-none stroke-[6]`}
                  />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    className={`${item.color} fill-none stroke-[6] transition-all duration-1000 ease-out`}
                    strokeDasharray="251"
                    strokeDashoffset={251 - (251 * item.percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-glass group-hover:scale-110 transition-transform duration-300">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-glass-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;