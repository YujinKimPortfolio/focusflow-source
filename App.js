// App.js
// This is my main application file of the project
// Here, I use a lot of React (useState, useEffect hooks), and some other external components to create a core logic of the app
// Some key features I wanted to integrate were 1) semi-automated task management 2) dark mode 3) productivity statistics using graphs (Rechart) 4) OpenAI-powered Assistant using OpenAI API key
// You will see an NLP button - I also attempted to create logic for it but ran out of time to come up with a full dataset of words I want it to categorize - so I am aiming to finish this functionality this summer.
// Throughout the entire project, for errors that I could not figure out, I got help from chatGPT in figuring out where the error is coming from and how to fix it. I also got a lot of help from it when it comes to overall organization - when I had created many functions and files and feel like they were not connected very well together, I always asked to make sure everything is connected, before the bug gets bigger as I build more code. 
 // Request notifications permission: 
 // Regarding this functionality, I plan to expand this feature into a Google Calender integration. Instead of only asking for local Notification permission, I want the button to ask the user to connect their google calendar account, and automatically add tasks as events into their Gcal. I decided to keep this part out of this project due to time constraints, but I really wish to continue working on this to build a full productivity app that integrates Gcal, personalized OpenAI, timer, visualization etc. 
 // localStorage Issue
 // Currently, task data and stats are not fully persistent across page refreshes. Although I started integrating localStorage, due to time constraints, I wasn't able to fully complete seamless data saving. In the summer, I plan to fully connect tasks, completedTasks, and points to localStorage or possibly a backend (like Firebase), so that user data remains across sessions and devices.
 // Streak System:
 // I wanted to build a simple daily streak system that rewards users for staying consistent day-to-day. Basically, if you complete any session today and you were also active yesterday, your streak increases by 1. Every 5 days, you would earn bonus points. 
// Right now, the basic logic is implemented (checkStreak function), but I realize the localStorage saving/loading isn't fully reliable.
// During summer, I want to work on improving this system. 

import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TimerScreen from './components/TimerScreen';
import Statistics from './components/Statistics';
import ProductivityTips from './components/ProductivityTips';
import { PieChart, LineChart } from 'recharts';

function App() {
  // Here, I wanted to manage tasks and UI settings like dark mode
  // some features like streaks and points are incomplete - I wish to put more time into this to come up with a better logic later on
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [workInterval, setWorkInterval] = useState(25);
  const [showStats, setShowStats] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories] = useState(['work', 'personal', 'school', 'other']);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [userLevel, setUserLevel] = useState('Novice');
  const [lastActiveDate, setLastActiveDate] = useState(null);
  
  // I used useEffect and localStorage to persist tasks and settings across browser sessions. 
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    const savedWorkInterval = localStorage.getItem('workInterval');
    if (savedWorkInterval) {
      setWorkInterval(parseInt(savedWorkInterval));
    }
    
    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    
    const savedPoints = localStorage.getItem('points');
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }
    
    const savedLevel = localStorage.getItem('userLevel');
    if (savedLevel) {
      setUserLevel(savedLevel);
    }
    
    const savedLastActiveDate = localStorage.getItem('lastActiveDate');
    if (savedLastActiveDate) {
      setLastActiveDate(savedLastActiveDate);
      checkStreak(savedLastActiveDate);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save completed tasks
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);
  
  // Save interval settings when they change
  useEffect(() => {
    localStorage.setItem('workInterval', workInterval);
  }, workInterval);
  
  // Save points and level
  useEffect(() => {
    localStorage.setItem('points', points);
    localStorage.setItem('streak', streak);
    localStorage.setItem('userLevel', userLevel);
    
    // Update level based on points
    if (points >= 1000) {
      setUserLevel('Master');
    } else if (points >= 500) {
      setUserLevel('Expert');
    } else if (points >= 200) {
      setUserLevel('Intermediate');
    } else {
      setUserLevel('Novice');
    }
  }, [points, streak]);
  
  // Check and update streak
  const checkStreak = (lastDate) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
    
    // Update last active date
    localStorage.setItem('lastActiveDate', today);
    setLastActiveDate(today);
    
    // If first time using the app
    if (!lastDate) return;
    
    // If last active yesterday, increment streak
    if (lastDate === yesterday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      // Bonus points for maintaining streak
      if (newStreak % 5 === 0) {
        setPoints(prev => prev + 50);
      }
    } 
    // If not active yesterday and not today, reset streak
    else if (lastDate !== today) {
      setStreak(1);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  // Add a new task
  const addTask = () => {
    const newTask = {
      id: Date.now(),
      description: '',
      category: 'personal', // Default category
      sessionCount: 0,
      createdAt: new Date().toISOString(),
      estimatedTime: 25 
    };
    setTasks([...tasks, newTask]);
  };
  
 // NLP categorization: This was my attempt to prototype a natural language feature, where you can type something like 'Finish homework' and have it categorized automatically. Right now, it's a basic version based on keyword matching — I don't consider this the main goal of the project yet. I plan to develop this into a true AI-powered feature this summer by connecting it to a real NLP model
  const addTaskWithNLP = (taskText) => {
    
    let category = 'personal';
    
    if (taskText.toLowerCase().includes('work') || 
        taskText.toLowerCase().includes('project') || 
        taskText.toLowerCase().includes('deadline')) {
      category = 'work';
    } else if (taskText.toLowerCase().includes('class') || 
              taskText.toLowerCase().includes('study') || 
              taskText.toLowerCase().includes('homework')) {
      category = 'school';
    }
    
    const newTask = {
      id: Date.now(),
      description: taskText,
      category,
      sessionCount: 0,
      createdAt: new Date().toISOString(),
      estimatedTime: 25
    };
    
    setTasks([...tasks, newTask]);
  };
  
  // Start a work session for a task
  const startTask = (task) => {
    setCurrentTask(task);
    setShowTimer(true);
    setShowStats(false);
    setShowTips(false);
  };
  
  // Update task session count on completion
  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId
        ? { 
            ...task, 
            sessionCount: (task.sessionCount || 0) + 1,
            completed: true,  // ✅ Mark as completed
            completedAt: new Date().toISOString()
          }
        : task
    );
  
    setTasks(updatedTasks); // ✅ Just update tasks, don't move
    setShowTimer(false);
    setPoints(prev => prev + 50);
    checkStreak(lastActiveDate);
  };
  
  
  
  
  // Filter tasks by category
  const filteredTasks = filterCategory === 'all'
  ? tasks
  : tasks.filter(task => task.category === filterCategory);


  
  // Task stats for visualization
const totalTasksCount = tasks.length + completedTasks.length;

const taskStats = {
  categories: categories.map(cat => ({
    name: cat,
    count: tasks.filter(task => task.category === cat).length
  })),
  completion: [
    { name: 'Completed', value: completedTasks.length },
    { name: 'Pending', value: tasks.length }
  ],
  totalTasksCount,
  completionRate: totalTasksCount === 0 ? 0 : Math.round((completedTasks.length / totalTasksCount) * 100),
};
  
  // Request notifications permission: Regarding this functionality, I plan to expand this feature into a Google Calender integration. Instead of only asking for local Notification permission, I want the button to ask the user to connect their google calendar account, and automatically add tasks as events into their Gcal. I decided to keep this part out of this project due to time constraints, but I really wish to continue working on this to build a full productivity app that integrates Gcal, personalized OpenAI, timer, visualization etc. 
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifications enabled!');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>FocusFlow</h1>
        <div className="header-controls">
          <div className="user-stats">
            <span className="streak">🔥 {streak} day streak</span>
            <span className="points">✨ {points} points</span>
            <span className="level">{userLevel}</span>
          </div>
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="notification-btn" onClick={requestNotificationPermission}>
            🔔
          </button>
        </div>
      </header>
      
      <main>
        {showTimer ? (
          <TimerScreen 
            task={currentTask}
            workInterval={workInterval}
            onComplete={completeTask}
            onStop={() => setShowTimer(false)}
          />
        ) : showStats ? (
          <Statistics 
            tasks={tasks}
            completedTasks={completedTasks}
            stats={taskStats}
            onClose={() => setShowStats(false)}
          />
        ) : showTips ? (
          <ProductivityTips 
            tasks={tasks}
            onClose={() => setShowTips(false)}
          />
        ) : (
          <>
            <div className="category-filter">
              <button 
                className={filterCategory === 'all' ? 'active' : ''} 
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={filterCategory === cat ? 'active' : ''} 
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            
            <TaskList 
              tasks={filteredTasks}
              onTaskEdit={(id, description, category, estimatedTime) => {
                setTasks(tasks.map(task => 
                  task.id === id 
                    ? { 
                        ...task, 
                        description, 
                        category: category || task.category,
                        estimatedTime: estimatedTime || task.estimatedTime
                      } 
                    : task
                ));
              }}
              onTaskDelete={(id) => {
                setTasks(tasks.filter(task => task.id !== id));
              }}
              onTaskStart={startTask}
              categories={categories}
            />
            
            <div className="action-buttons">
              <button className="add-task-btn" onClick={addTask}>＋ add task</button>

            {/* Incomplete - will develop further during summer */}
            <button 
              className="nlp-task-btn" 
              onClick={() => {
                const taskText = prompt("Describe your task in natural language:");
                if (taskText) {
                  addTaskWithNLP(taskText);
                }
              }}
              >
                🗣️ add with NLP
              </button>
            
              <button className="stats-btn" onClick={() => setShowStats(true)}>
                📊 statistics
              </button>
              <button className="tips-btn" onClick={() => setShowTips(true)}>
                💡 get tips
              </button>
            </div>
            
            <div className="interval-settings">
              <div>
                <label htmlFor="work-interval">Work interval (minutes):</label>
                <input 
                  id="work-interval" 
                  type="number" 
                  min="1"
                  value={workInterval}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWorkInterval(value); // Save whatever the user types, including ""
                  }}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;