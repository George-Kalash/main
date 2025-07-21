import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, BookOpen, Edit2, Trash2, Star, Zap } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  course: string;
  type: 'assignment' | 'exam' | 'project' | 'quiz' | 'presentation';
  date: string;
  time?: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Project 2 Due',
      course: 'CS 301',
      type: 'project',
      date: '2024-12-20',
      time: '23:59',
      description: 'Data Structures implementation project',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Final Exam',
      course: 'MATH 250',
      type: 'exam',
      date: '2024-12-22',
      time: '10:00',
      description: 'Comprehensive calculus exam',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      title: 'Research Paper',
      course: 'ENG 202',
      type: 'assignment',
      date: '2024-12-18',
      time: '23:59',
      description: 'Technical writing research paper',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      title: 'Lab Report',
      course: 'PHYS 201',
      type: 'assignment',
      date: '2024-12-15',
      time: '23:59',
      description: 'Physics lab experiment report',
      priority: 'medium',
      completed: true
    },
    {
      id: '5',
      title: 'Presentation',
      course: 'HIST 101',
      type: 'presentation',
      date: '2024-12-19',
      time: '14:00',
      description: 'World War II historical analysis',
      priority: 'high',
      completed: false
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'from-blue-400 to-blue-600';
      case 'exam': return 'from-red-400 to-red-600';
      case 'project': return 'from-purple-400 to-purple-600';
      case 'quiz': return 'from-green-400 to-green-600';
      case 'presentation': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeGlow = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-400/20';
      case 'exam': return 'bg-red-400/20';
      case 'project': return 'bg-purple-400/20';
      case 'quiz': return 'bg-green-400/20';
      case 'presentation': return 'bg-orange-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="h-3 w-3 text-red-400" />;
      case 'medium': return <Star className="h-3 w-3 text-yellow-400" />;
      case 'low': return <Clock className="h-3 w-3 text-green-400" />;
      default: return <Clock className="h-3 w-3 text-blue-400" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const upcomingEvents = events
    .filter(event => !event.completed && new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-8">
      {/* Header with Glass Effect */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="glass-button p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="glass-button p-3 hover:scale-105 transition-transform duration-200"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="glass-button p-3 hover:scale-105 transition-transform duration-200"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="glass-nav rounded-xl">
              {['month', 'week', 'day'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType as 'month' | 'week' | 'day')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    view === viewType
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-glass-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>
            <button className="glass-button px-6 py-3 glass-shimmer group">
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white font-medium">Add Event</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid with Glass Effect */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center">
                <span className="text-sm font-semibold text-glass-muted">{day}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-3 transition-all duration-300 group ${
                    isToday(day)
                      ? 'glass-calendar-today'
                      : isCurrentMonth(day)
                      ? 'glass-calendar-day hover:bg-white/8'
                      : 'glass-calendar-day opacity-50'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday(day) ? 'text-white' : 'text-glass'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded-md text-white font-medium bg-gradient-to-r ${getTypeColor(event.type)} ${
                          event.completed ? 'opacity-50 line-through' : 'shadow-sm'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-glass-muted font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar with Upcoming Events */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass-button p-2">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-glass">Upcoming Events</h3>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={event.id} className="glass-course-card p-4 group glass-shimmer" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-glass">{event.title}</h4>
                        {getPriorityIcon(event.priority)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-glass-muted">{event.course}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(event.type)} text-white`}>
                          {event.type}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-glass-subtle">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="glass-button p-2 hover:bg-blue-400/20">
                        <Edit2 className="h-3 w-3 text-blue-400" />
                      </button>
                      <button className="glass-button p-2 hover:bg-red-400/20">
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats with Glass Effect */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass-button p-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-glass">Quick Stats</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Total Events', value: events.length, color: 'from-blue-400 to-blue-600' },
                { label: 'Completed', value: events.filter(e => e.completed).length, color: 'from-green-400 to-green-600' },
                { label: 'Pending', value: events.filter(e => !e.completed).length, color: 'from-orange-400 to-orange-600' },
                { label: 'High Priority', value: events.filter(e => e.priority === 'high' && !e.completed).length, color: 'from-red-400 to-red-600' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass-course-card group">
                  <span className="text-sm text-glass-muted">{stat.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-glass group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </span>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;