// TaskItem.js
// I wanted this file to handle the display and editing of a single task. I made sure each task could be edited directly from the list, and brought a lot of base code from previous problem set. However, I wanted to use more of React components this time. I also used lemons here. 
// It was important for me to keep this component organized because it has a lot of different states, which took a lot of time and careful debugging. 

import React, { useState } from 'react';

function TaskItem({ task, onEdit, onDelete, onStart, categories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category || 'personal');
  const [estimatedTimeInput, setEstimatedTimeInput] = useState(task.estimatedTime?.toString() || '25');

  // Switching to editing mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // saving the change to the task 
  const handleSave = () => {
    const parsedTime = parseInt(estimatedTimeInput, 10);
    onEdit(task.id, description, category, isNaN(parsedTime) ? 25 : parsedTime);
    setIsEditing(false);
  };

  // canceling editing
  const handleCancel = () => {
    setDescription(task.description);
    setCategory(task.category || 'personal');
    setEstimatedTimeInput(task.estimatedTime?.toString() || '25');
    setIsEditing(false);
  };

  // Render lemon icons for completed sessions
  const renderSessionCount = () => {
    if (!task.sessionCount || task.sessionCount === 0) return null;
    return (
      <span className="session-counter">
        {Array.from({ length: task.sessionCount }).map((_, index) => (
          <span key={index} className="session-icon">🍋</span>
        ))}
      </span>
    );
  };

  // Generate category badge color
  const getCategoryBadge = () => {
    const colorMap = {
      work: '#f87171',      // Red
      personal: '#60a5fa',  // Blue
      school: '#fbbf24',    // Yellow
      other: '#a3e635'      // Green
    };
    return (
      <span 
        className="category-badge" 
        style={{ backgroundColor: colorMap[category] || '#9ca3af' }}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <li className={`task-item ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estimated Time (minutes):</label>
            <input
              type="text"
              value={estimatedTimeInput}
              onChange={(e) => setEstimatedTimeInput(e.target.value)}
              placeholder="25"
            />
          </div>

          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <div className="task-header">
              {getCategoryBadge()}
              {task.estimatedTime && (
                <span className="estimated-time">
                  ⏱️ {task.estimatedTime} min
                </span>
              )}
            </div>

            <div className="task-body" onClick={handleEdit}>
              <p className={task.description ? "task-description" : "placeholder"}>
                {task.description || "Task Description"}
              </p>
              {renderSessionCount()}
            </div>
          </div>

          <div className="task-actions">
            <button className="start-btn" onClick={() => onStart(task)}>▶️ start</button>
            <button className="edit-btn" onClick={handleEdit}>✏️</button>
            <button className="delete-btn" onClick={() => onDelete(task.id)}>🗑️</button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
