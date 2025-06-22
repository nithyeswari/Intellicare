import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, Target, Share2, Copy, Check } from 'lucide-react';

const LifeWeekCalendar = () => {
  const [procrastinationItems, setProcrastinationItems] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [newItem, setNewItem] = useState('');
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
  
  // Generate weeks for the year (52 weeks)
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  
  // Sample procrastination items for demonstration
  const sampleItems = {
    [currentWeek]: ['Start that fitness routine', 'Call the dentist'],
    [currentWeek + 1]: ['Organize home office', 'Learn Spanish'],
    [currentWeek + 2]: ['Update resume'],
  };
  
  // Initialize with sample items if none exist
  const items = Object.keys(procrastinationItems).length === 0 ? sampleItems : procrastinationItems;

  const addItem = () => {
    if (newItem.trim() && selectedWeek) {
      setProcrastinationItems(prev => ({
        ...prev,
        [selectedWeek]: [...(prev[selectedWeek] || []), newItem.trim()]
      }));
      setNewItem('');
    }
  };

  const removeItem = (week, index) => {
    setProcrastinationItems(prev => ({
      ...prev,
      [week]: prev[week].filter((_, i) => i !== index)
    }));
  };

  const createShareableLink = () => {
    // Encode the procrastination items data
    const dataToShare = Object.keys(items).length > 0 ? items : procrastinationItems;
    const encodedData = btoa(JSON.stringify(dataToShare));
    
    // In a real deployment, this would be your actual domain
    const baseUrl = "https://your-calendar.com/shared/";
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
      // Fallback for older browsers
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

  const getMonthName = (weekNum) => {
    const year = currentYear;
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (weekNum - 1) * 7;
    const weekStart = new Date(firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return weekStart.toLocaleDateString('en-US', { month: 'short' });
  };

  // Group weeks into quarters for better organization
  const quarters = [
    { name: 'Q1', weeks: weeks.slice(0, 13), color: 'bg-blue-50' },
    { name: 'Q2', weeks: weeks.slice(13, 26), color: 'bg-green-50' },
    { name: 'Q3', weeks: weeks.slice(26, 39), color: 'bg-yellow-50' },
    { name: 'Q4', weeks: weeks.slice(39, 52), color: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Calendar className="text-blue-600" size={32} />
            Life Week Calendar {currentYear}
          </h1>
          <p className="text-gray-600 text-lg">Track what you're procrastinating on and plan when to tackle it</p>
          <p className="text-blue-600 mt-2 font-medium">Current week: {currentWeek}</p>
          
          <button
            onClick={createShareableLink}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto font-medium shadow-md"
          >
            <Share2 size={20} />
            Create Shareable Link
          </button>
        </div>

        <div className="space-y-8 mb-8">
          {quarters.map((quarter, qIndex) => (
            <div key={quarter.name} className={`${quarter.color} rounded-lg p-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">{quarter.name} - {getMonthName(quarter.weeks[0])} to {getMonthName(quarter.weeks[quarter.weeks.length - 1])}</h3>
              <div className="grid grid-cols-13 gap-2">
                {quarter.weeks.map(week => {
                  const status = getWeekStatus(week);
                  const hasItems = items[week] && items[week].length > 0;
                  
                  return (
                    <div
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className={`
                        relative h-16 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 border-2
                        ${status === 'past' ? 'bg-gray-100 text-gray-500 border-gray-200' : ''}
                        ${status === 'current' ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-lg' : ''}
                        ${status === 'future' ? 'bg-white text-gray-700 hover:bg-blue-50 border-gray-200 hover:border-blue-300' : ''}
                        ${selectedWeek === week ? 'ring-4 ring-blue-300 scale-105' : ''}
                        ${hasItems ? 'border-red-400 bg-red-50' : ''}
                      `}
                      title={`Week ${week} - ${getWeekDate(week)} ${hasItems ? '(Has procrastination items)' : ''}`}
                    >
                      <span className="text-sm font-semibold">{week}</span>
                      <span className="text-xs opacity-75">{getMonthName(week)}</span>
                      {hasItems && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">{items[week].length}</span>
                        </div>
                      )}

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Share2 className="text-green-600" />
                  Share Your Calendar
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Share this link with others to show them your procrastination calendar:
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
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Note:</strong> In a real deployment, this would create an actual shareable link. The data is encoded and ready to be shared!
                </p>
              </div>
            </div>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Target className="text-blue-600" />
              Week {selectedWeek} - {getWeekDate(selectedWeek)}
              {selectedWeek === currentWeek && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  This Week
                </span>
              )}
            </h3>
            
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="What are you procrastinating on?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>

            <div className="space-y-3">
              {items[selectedWeek] && items[selectedWeek].length > 0 ? (
                items[selectedWeek].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <Clock className="text-amber-500 flex-shrink-0" size={20} />
                    <span className="flex-1 text-gray-800 text-lg">{item}</span>
                    <button
                      onClick={() => removeItem(selectedWeek, index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No procrastination items for this week.</p>
                  <p className="text-2xl mt-2">🎉</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-bold text-gray-800 mb-3 text-lg">How to use this calendar:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="space-y-2">
              <p>• Click on any week to add procrastination items</p>
              <p>• Red badges show weeks with pending tasks</p>
              <p>• Current week is highlighted in blue</p>
            </div>
            <div className="space-y-2">
              <p>• Organize by quarters (Q1, Q2, Q3, Q4)</p>
              <p>• Break big tasks into smaller weekly goals</p>
              <p>• Plan ahead and spread out your workload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeWeekCalendar;