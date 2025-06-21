import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Check, X, Clock, Target, Trophy, Zap, Share2, Copy, Download } from 'lucide-react';

const FocusFlowApp = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", priority: "high", completed: false },
    { id: 2, text: "Review emails", priority: "low", completed: false },
    { id: 3, text: "Call client about meeting", priority: "medium", completed: false }
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  
  // Stats state
  const [completedToday, setCompletedToday] = useState(0);
  const [focusStreak, setFocusStreak] = useState(3);
  
  // Share state
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const intervalRef = useRef(null);

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setTasks(decodedData.tasks || tasks);
        setCompletedToday(decodedData.completedToday || 0);
        setFocusStreak(decodedData.focusStreak || 3);
        setCycleCount(decodedData.cycleCount || 0);
        setDataLoaded(true);
        setTimeout(() => setDataLoaded(false), 3000); // Hide notification after 3 seconds
      } catch (error) {
        console.error('Failed to load shared data:', error);
      }
    }
  }, []);

  // Generate shareable URL
  const generateShareUrl = () => {
    const stateData = {
      tasks: tasks,
      completedToday: completedToday,
      focusStreak: focusStreak,
      cycleCount: cycleCount,
      timestamp: new Date().toISOString()
    };
    
    const encodedData = btoa(JSON.stringify(stateData));
    const baseUrl = window.location.origin + window.location.pathname;
    const newShareUrl = `${baseUrl}?data=${encodedData}`;
    setShareUrl(newShareUrl);
    setShowShareModal(true);
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (isBreak) {
        setTimeLeft(25 * 60); // Back to work
        setIsBreak(false);
      } else {
        setCycleCount(prev => prev + 1);
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
        setFocusStreak(prev => prev + 1);
      }
      setIsActive(false);
      playNotification();
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, isBreak]);
  
  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };
  
  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        priority: selectedPriority,
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };
  
  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        if (!task.completed && updated.completed) {
          setCompletedToday(prev => prev + 1);
        } else if (task.completed && !updated.completed) {
          setCompletedToday(prev => Math.max(0, prev - 1));
        }
        return updated;
      }
      return task;
    }));
  };
  
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete && taskToDelete.completed) {
      setCompletedToday(prev => Math.max(0, prev - 1));
    }
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };
  
  const motivationalMessages = [
    "You've got this! 💪",
    "Focus brings freedom! 🎯",
    "Small steps, big results! 🚀",
    "Progress over perfection! ✨",
    "Your future self will thank you! 🌟"
  ];
  
  const currentMessage = motivationalMessages[cycleCount % motivationalMessages.length];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Focus Flow
          </h1>
          <p className="text-gray-600">Beat procrastination with the power of focused work</p>
          
          {/* Share Button */}
          <button
            onClick={generateShareUrl}
            className="absolute top-0 right-0 flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Share2 size={18} />
            Share Progress
          </button>
        </div>

        {/* Data Loaded Notification */}
        {dataLoaded && (
          <div className="mb-6 bg-green-100 border border-green-300 rounded-xl p-4 text-center">
            <p className="text-green-800 font-medium">
              ✅ Shared data loaded successfully! Your progress and tasks have been restored.
            </p>
          </div>
        )}
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-purple-600">{completedToday}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <Zap className="text-blue-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Focus Cycles</p>
                <p className="text-2xl font-bold text-blue-600">{cycleCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
            <div className="flex items-center gap-2">
              <Target className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-green-600">{focusStreak}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pomodoro Timer */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {isBreak ? "Break Time! 🎉" : "Focus Time 🎯"}
              </h2>
              <p className="text-gray-600 mb-6">{currentMessage}</p>
              
              <div className="relative mb-8">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-2xl">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl font-mono font-bold text-gray-800">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                {/* Progress ring */}
                <div className="absolute inset-0 w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (timeLeft / (isBreak ? 5 * 60 : 25 * 60))}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Task Management */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-purple-500" />
              Today's Tasks
            </h2>
            
            {/* Add Task */}
            <div className="mb-6">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Task List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-300 opacity-60' 
                      : getPriorityColor(task.priority)
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <Check size={14} />}
                      </button>
                      <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.text}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No tasks yet. Add one above to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Motivational Footer */}
        <div className="mt-8 text-center bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            "The secret of getting ahead is getting started." - Mark Twain
          </h3>
          <p className="text-gray-600">
            Every small step counts. You're building momentum with each completed task! 🌟
          </p>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-center">Share Your Progress! 🚀</h3>
              <p className="text-gray-600 mb-6 text-center">
                Copy this link to save your progress and share it with others. Anyone with this link can see your current tasks and stats.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Share Link:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      copySuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Bookmark this link to save your progress</li>
                  <li>• Share with teammates to sync tasks</li>
                  <li>• Generate new links as your progress updates</li>
                  <li>• Works across all devices and browsers</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Open Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusFlowApp;