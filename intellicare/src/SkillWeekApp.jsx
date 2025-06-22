import React, { useState } from 'react';
import { Plus, X, Brain, Trophy, Target, Star, BookOpen, CheckCircle, Clock, Lightbulb, Share2, Copy, Check } from 'lucide-react';

const SkillWeekApp = () => {
  const [skills, setSkills] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('beginner');
  const [shareableLink, setShareableLink] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();
  
  // Sample skills for demonstration
  const sampleSkills = {
    [currentWeek]: { name: 'Speed Reading', difficulty: 'intermediate', completed: false },
    [currentWeek + 1]: { name: 'Basic Photography', difficulty: 'beginner', completed: false },
    [currentWeek + 2]: { name: 'Cooking Pasta Perfectly', difficulty: 'beginner', completed: true },
    [currentWeek + 3]: { name: 'Meditation Basics', difficulty: 'beginner', completed: false },
  };
  
  // Initialize with sample skills if none exist
  const activeSkills = Object.keys(skills).length === 0 ? sampleSkills : skills;

  // Skill suggestions by category
  const skillSuggestions = {
    'Creative': ['Watercolor Painting', 'Digital Drawing', 'Creative Writing', 'Photography Basics', 'Origami', 'Calligraphy', 'Video Editing', 'Music Theory'],
    'Technical': ['Python Basics', 'Excel Formulas', 'Touch Typing', 'Basic HTML/CSS', 'Photoshop Essentials', 'Data Analysis', 'Git & GitHub', '3D Modeling'],
    'Life Skills': ['Speed Reading', 'Time Management', 'Public Speaking', 'Negotiation', 'Memory Techniques', 'Financial Planning', 'Cooking Basics', 'First Aid'],
    'Physical': ['Yoga Fundamentals', 'Juggling', 'Basic Dance Moves', 'Meditation', 'Breathing Techniques', 'Stretching Routines', 'Balance Training', 'Handstands'],
    'Language': ['Spanish Basics', 'Sign Language', 'Pronunciation', 'Writing Skills', 'Speed Reading', 'Storytelling', 'Poetry Writing', 'Public Speaking'],
    'Professional': ['Leadership Skills', 'Project Management', 'Email Etiquette', 'Networking', 'Interview Skills', 'Presentation Skills', 'Sales Basics', 'Customer Service']
  };

  const addSkill = () => {
    if (newSkill.trim() && selectedWeek) {
      setSkills(prev => ({
        ...prev,
        [selectedWeek]: {
          name: newSkill.trim(),
          difficulty: newDifficulty,
          completed: false
        }
      }));
      setNewSkill('');
      setNewDifficulty('beginner');
    }
  };

  const toggleComplete = (week) => {
    setSkills(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        completed: !prev[week].completed
      }
    }));
  };

  const removeSkill = (week) => {
    setSkills(prev => {
      const newSkills = { ...prev };
      delete newSkills[week];
      return newSkills;
    });
  };

  const getWeekDate = (weekNum) => {
    const year = currentYear;
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (weekNum - 1) * 7;
    const weekStart = new Date(firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWeekStatus = (weekNum) => {
    if (weekNum < currentWeek) return 'past';
    if (weekNum === currentWeek) return 'current';
    return 'future';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCompletedCount = () => {
    return Object.values(activeSkills).filter(skill => skill.completed).length;
  };

  const createShareableLink = () => {
    const dataToShare = Object.keys(activeSkills).length > 0 ? activeSkills : skills;
    const encodedData = btoa(JSON.stringify(dataToShare));
    const baseUrl = "https://52skills.app/shared/";
    const shareLink = `${baseUrl}?data=${encodedData}`;
    
    setShareableLink(shareLink);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Group weeks into quarters
  const quarters = [
    { name: 'Q1', weeks: Array.from({ length: 13 }, (_, i) => i + 1), color: 'bg-blue-50', theme: 'New Beginnings' },
    { name: 'Q2', weeks: Array.from({ length: 13 }, (_, i) => i + 14), color: 'bg-green-50', theme: 'Growth & Learning' },
    { name: 'Q3', weeks: Array.from({ length: 13 }, (_, i) => i + 27), color: 'bg-yellow-50', theme: 'Summer Skills' },
    { name: 'Q4', weeks: Array.from({ length: 13 }, (_, i) => i + 40), color: 'bg-purple-50', theme: 'Mastery & Reflection' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Brain className="text-indigo-600" size={36} />
            52 Skills Challenge {currentYear}
          </h1>
          <p className="text-gray-600 text-lg">Learn a new skill every week for a year</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <span className="text-gray-700 font-medium">{getCompletedCount()}/52 Skills Mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              <span className="text-gray-700 font-medium">Week {currentWeek}</span>
            </div>
          </div>
          
          <button
            onClick={createShareableLink}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto font-medium shadow-md"
          >
            <Share2 size={20} />
            Share My Challenge
          </button>
        </div>

        <div className="space-y-8 mb-8">
          {quarters.map((quarter) => (
            <div key={quarter.name} className={`${quarter.color} rounded-lg p-6 border border-opacity-30`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{quarter.name} - {quarter.theme}</h3>
                  <p className="text-gray-600">Weeks {quarter.weeks[0]} - {quarter.weeks[quarter.weeks.length - 1]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completed:</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {quarter.weeks.filter(week => activeSkills[week]?.completed).length}/{quarter.weeks.length}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-13 gap-2">
                {quarter.weeks.map(week => {
                  const status = getWeekStatus(week);
                  const skill = activeSkills[week];
                  const hasSkill = !!skill;
                  const isCompleted = skill?.completed;
                  
                  return (
                    <div
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className={`
                        relative h-20 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 border-2 p-1
                        ${status === 'past' ? 'bg-gray-100 border-gray-200' : ''}
                        ${status === 'current' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : ''}
                        ${status === 'future' ? 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50' : ''}
                        ${selectedWeek === week ? 'ring-4 ring-indigo-300 scale-105' : ''}
                        ${hasSkill && !isCompleted ? 'border-orange-400' : ''}
                        ${isCompleted ? 'border-green-400 bg-green-50' : ''}
                      `}
                      title={`Week ${week} - ${getWeekDate(week)} ${hasSkill ? `: ${skill.name}` : ''}`}
                    >
                      <span className="text-xs font-semibold">{week}</span>
                      {hasSkill ? (
                        <div className="text-center flex-1 flex flex-col justify-center">
                          <span className="text-xs font-medium truncate w-full px-1" title={skill.name}>
                            {skill.name.length > 8 ? skill.name.substring(0, 8) + '...' : skill.name}
                          </span>
                          <span className={`text-xs px-1 rounded mt-1 ${getDifficultyColor(skill.difficulty)} border`}>
                            {skill.difficulty[0].toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <Plus className="text-gray-400" size={16} />
                      )}
                      
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedWeek && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6 border border-indigo-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Target className="text-indigo-600" />
              Week {selectedWeek} - {getWeekDate(selectedWeek)}
              {selectedWeek === currentWeek && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  This Week
                </span>
              )}
            </h3>
            
            {activeSkills[selectedWeek] ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800">{activeSkills[selectedWeek].name}</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 border ${getDifficultyColor(activeSkills[selectedWeek].difficulty)}`}>
                        {activeSkills[selectedWeek].difficulty} level
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleComplete(selectedWeek)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          activeSkills[selectedWeek].completed
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {activeSkills[selectedWeek].completed ? 'Completed! 🎉' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => removeSkill(selectedWeek)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="What skill will you learn this week?"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button
                    onClick={addSkill}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus size={20} />
                    Add Skill
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" />
                    Skill Suggestions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(skillSuggestions).map(([category, categorySkills]) => (
                      <div key={category}>
                        <h5 className="font-medium text-gray-700 mb-2">{category}</h5>
                        <div className="space-y-1">
                          {categorySkills.slice(0, 3).map(skill => (
                            <button
                              key={skill}
                              onClick={() => setNewSkill(skill)}
                              className="block w-full text-left text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Share2 className="text-indigo-600" />
                  Share Your 52 Skills Challenge
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Share your skill learning journey with others:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4 border">
                <code className="text-sm text-gray-800 break-all">
                  {shareableLink}
                </code>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800">
                  🏆 <strong>Challenge:</strong> Learning 52 skills in a year means becoming 1% better every week!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
            <BookOpen className="text-indigo-600" />
            How the 52 Skills Challenge Works
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-3">
              <p>🎯 <strong>One skill per week:</strong> Focus on learning something new every 7 days</p>
              <p>📈 <strong>Track progress:</strong> Mark skills as completed when you've learned them</p>
              <p>⭐ <strong>Difficulty levels:</strong> Mix beginner, intermediate, and advanced skills</p>
            </div>
            <div className="space-y-3">
              <p>🗓️ <strong>Quarterly themes:</strong> Each quarter has a different learning focus</p>
              <p>💡 <strong>Skill suggestions:</strong> Get inspired by our curated skill categories</p>
              <p>🤝 <strong>Share your journey:</strong> Motivate others by sharing your progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillWeekApp;