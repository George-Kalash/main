import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, BookOpen, GraduationCap, Star, Award } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  professor: string;
  grade?: string;
  status: 'current' | 'completed' | 'planned';
}

interface Semester {
  id: string;
  name: string;
  year: number;
  season: string;
  courses: Course[];
  gpa?: number;
  status: 'current' | 'completed' | 'planned';
}

const SemesterView: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: '1',
      name: 'Fall 2024',
      year: 2024,
      season: 'Fall',
      status: 'current',
      courses: [
        { id: '1', code: 'CS 301', name: 'Data Structures', credits: 3, professor: 'Dr. Smith', status: 'current' },
        { id: '2', code: 'MATH 250', name: 'Calculus II', credits: 4, professor: 'Dr. Johnson', status: 'current' },
        { id: '3', code: 'ENG 202', name: 'Technical Writing', credits: 3, professor: 'Prof. Davis', status: 'current' },
        { id: '4', code: 'PHYS 201', name: 'Physics I', credits: 4, professor: 'Dr. Wilson', status: 'current' },
        { id: '5', code: 'HIST 101', name: 'World History', credits: 3, professor: 'Prof. Brown', status: 'current' },
      ]
    },
    {
      id: '2',
      name: 'Spring 2024',
      year: 2024,
      season: 'Spring',
      status: 'completed',
      gpa: 3.67,
      courses: [
        { id: '6', code: 'CS 201', name: 'Programming Fundamentals', credits: 3, professor: 'Dr. Anderson', grade: 'A', status: 'completed' },
        { id: '7', code: 'MATH 150', name: 'Calculus I', credits: 4, professor: 'Dr. Taylor', grade: 'B+', status: 'completed' },
        { id: '8', code: 'ENG 101', name: 'English Composition', credits: 3, professor: 'Prof. Miller', grade: 'A-', status: 'completed' },
        { id: '9', code: 'CHEM 101', name: 'General Chemistry', credits: 4, professor: 'Dr. Garcia', grade: 'B', status: 'completed' },
      ]
    },
    {
      id: '3',
      name: 'Spring 2025',
      year: 2025,
      season: 'Spring',
      status: 'planned',
      courses: [
        { id: '10', code: 'CS 401', name: 'Algorithms', credits: 3, professor: 'Dr. Lee', status: 'planned' },
        { id: '11', code: 'MATH 300', name: 'Linear Algebra', credits: 3, professor: 'Dr. White', status: 'planned' },
        { id: '12', code: 'CS 350', name: 'Database Systems', credits: 3, professor: 'Dr. Clark', status: 'planned' },
      ]
    }
  ]);

  const [selectedSemester, setSelectedSemester] = useState<string>('1');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'from-blue-400 to-blue-600';
      case 'completed': return 'from-green-400 to-green-600';
      case 'planned': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-400/20';
      case 'completed': return 'bg-green-400/20';
      case 'planned': return 'bg-purple-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'from-green-400 to-green-600';
    if (grade?.startsWith('B')) return 'from-blue-400 to-blue-600';
    if (grade?.startsWith('C')) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const currentSemester = semesters.find(s => s.id === selectedSemester);
  const totalCredits = currentSemester?.courses.reduce((sum, course) => sum + course.credits, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Semester Selector with Glass Effect */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="glass-button p-2">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-glass">Semester Overview</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {semesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => setSelectedSemester(semester.id)}
              className={`glass-button px-6 py-3 transition-all duration-300 group ${
                selectedSemester === semester.id ? 'ring-2 ring-white/30' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-white" />
                <div className="text-left">
                  <span className="font-medium text-glass block">{semester.name}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(semester.status)} text-white`}>
                      {semester.status}
                    </div>
                    {semester.gpa && (
                      <span className="text-xs text-glass-muted">GPA: {semester.gpa}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Semester Details */}
      {currentSemester && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-2">{currentSemester.name}</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-glass-muted" />
                  <span className="text-glass-muted">
                    {currentSemester.courses.length} courses
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-glass-muted" />
                  <span className="text-glass-muted">
                    {totalCredits} credits
                  </span>
                </div>
                {currentSemester.gpa && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-glass">
                      GPA: <span className="gradient-text-accent">{currentSemester.gpa.toFixed(2)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button className="glass-button px-6 py-3 glass-shimmer group">
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white font-medium">Add Course</span>
              </div>
            </button>
          </div>

          {/* Courses Grid with Enhanced Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSemester.courses.map((course, index) => (
              <div key={course.id} className="glass-course-card p-5 group glass-shimmer" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-glass text-lg">{course.code}</h4>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-glass-muted mb-2 font-medium">{course.name}</p>
                    <p className="text-xs text-glass-subtle">{course.professor}</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="glass-button p-2 hover:bg-blue-400/20">
                      <Edit2 className="h-3 w-3 text-blue-400" />
                    </button>
                    <button className="glass-button p-2 hover:bg-red-400/20">
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-glass-muted">{course.credits} credits</span>
                    <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                    <div className={`w-3 h-3 rounded-full ${getStatusGlow(course.status)}`}></div>
                  </div>
                  {course.grade && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getGradeColor(course.grade)} text-white shadow-lg`}>
                      {course.grade}
                    </div>
                  )}
                </div>

                {/* Progress bar for visual appeal */}
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getStatusColor(course.status)} rounded-full transition-all duration-1000`} 
                       style={{ width: `${course.grade ? 100 : 60 + index * 10}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semester Statistics with Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Semesters', value: semesters.length, icon: Calendar, color: 'from-blue-400 to-blue-600', glow: 'bg-blue-400/20' },
          { label: 'Total Courses', value: semesters.reduce((sum, sem) => sum + sem.courses.length, 0), icon: BookOpen, color: 'from-green-400 to-green-600', glow: 'bg-green-400/20' },
          { label: 'Total Credits', value: semesters.reduce((sum, sem) => sum + sem.courses.reduce((courseSum, course) => courseSum + course.credits, 0), 0), icon: GraduationCap, color: 'from-purple-400 to-purple-600', glow: 'bg-purple-400/20' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-stat-card p-6 group">
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
                     style={{ width: `${70 + index * 10}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemesterView;