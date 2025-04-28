// // Statistics.js
// This file creates the "Productivity Statistics" screen for FocusFlow. I built this screen to visualize user behavior clearly using React, Recharts, and basic math aggregation. Having learned more about visualization in SI 330 and POWER BI data visualizations through TO 450, I wanted to integrate data viz tools in my app as well. 
// Originally, I tried to show Focus Sessions (Pomodoro sessions), but after refining, I decided to show actual Task Completion for better accuracy and understanding.
// During summer break, I hope to improve these stats even further by adding daily activity trends and custom charts for session times!

import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Statistics({ tasks, completedTasks, stats, onClose }) {
  const [activeView, setActiveView] = useState('overview');


  const COLORS = ['#00C49F', '#8884d8']; // Green = completed, Purple = pending

  // Total focus sessions = sum of sessions from both pending and completed tasks
  const totalFocusSessions = tasks.reduce((sum, task) => sum + (task.sessionCount || 0), 0) + completedTasks.reduce((sum, task) => sum + (task.sessionCount || 0), 0);

  const totalPendingTasks = tasks.length; // still open tasks

  // For the Bar Chart (Time Spent by Category) — only based on fully completed tasks
  const calculateTimeByCategory = () => {
    const categories = {};
    completedTasks.forEach(task => {
      const cat = task.category || 'Other';
      categories[cat] = (categories[cat] || 0) + (task.sessionCount || 1) * 25; // 25 min per session
    });
    return Object.keys(categories).map(cat => ({ name: cat, minutes: categories[cat] }));
  };

  // For line chart: progress week by week
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const weeks = [
      { name: "Week 1", created: 0, completed: 0 },
      { name: "Week 2", created: 0, completed: 0 },
      { name: "Week 3", created: 0, completed: 0 },
      { name: "Week 4", created: 0, completed: 0 }
    ];

    [...tasks, ...completedTasks].forEach(task => {
      const createdAt = new Date(task.createdAt);
      const diffWeeks = Math.floor((now - createdAt) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks < 4) {
        weeks[3 - diffWeeks].created += 1;
        if (task.completedAt) {
          weeks[3 - diffWeeks].completed += 1;
        }
      }
    });

    return weeks.map(week => ({
      ...week,
      rate: week.created > 0 ? Math.round((week.completed / week.created) * 100) : 0
    }));
  };

  // function that switches which chart to display depending on user click
  const renderChart = () => {
    if (activeView === 'overview') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Focus Sessions Completed', value: totalFocusSessions },
                { name: 'Pending Tasks', value: totalPendingTasks }
              ]}
              dataKey="value"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (activeView === 'categories') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={calculateTimeByCategory()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeView === 'weekly') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calculateWeeklyProgress()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name="Tasks Created" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Tasks Completed" />
            <Line type="monotone" dataKey="rate" stroke="#ffc658" name="Completion Rate (%)" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="statistics-screen">
      <div className="statistics-header">
        <h2>Your Productivity Stats</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="view-selector">
        <button onClick={() => setActiveView('overview')} className={activeView === 'overview' ? 'active' : ''}>Overview</button>
        <button onClick={() => setActiveView('categories')} className={activeView === 'categories' ? 'active' : ''}>By Category</button>
        <button onClick={() => setActiveView('weekly')} className={activeView === 'weekly' ? 'active' : ''}>Weekly Progress</button>
      </div>

      <div className="chart-view">
        {renderChart()}
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h4>Total Focus Sessions</h4>
          <p>{totalFocusSessions}</p>
        </div>
        <div className="stat-card">
          <h4>Pending Tasks</h4>
          <p>{totalPendingTasks}</p>
        </div>
      </div>

      <div className="statistics-footer">
        <p>Track how many sessions you complete! Every session helps you earn more points 🔥</p>
      </div>
    </div>
  );
}

export default Statistics;