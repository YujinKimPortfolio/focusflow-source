// TimerScreen.js
// Here, I started from Project 6 as my base code but implemented more of useState, useEffect, and useRef to make everything efficient. Thus, I wanted to make a simplified timer screen built with React, useState, useEffect, and minimal extra logic. 
// Main goals I had for this implementation was 1) allowing pause/resume funtionality, 2) Switching automatically betwen work and break sessions 3) adding reset button 
// I specifically focused on handling pause/resume and session switching properly.


// Here, I wanted to dynamically set initial times based on task-specific estimated time

import React, { useState, useEffect, useRef } from 'react';

function TimerScreen({ task, workInterval = 25, onComplete, onStop }) {
  // Set initial time based on task-specific estimated time
  const initialWorkTime = (task.estimatedTime || workInterval) * 60;

  const [timeLeft, setTimeLeft] = useState(initialWorkTime);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer to full work time
  const resetTimer = () => {
    setTimeLeft(initialWorkTime);
  };

  // Timer countdown logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);

            if (onComplete) {
              onComplete(task.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, task.id, onComplete]);

  // Toggle pause/resume
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="timer-screen">
      <h2>Focus Time!</h2>
      <p className="task-description">{task.description}</p>

      <div className="timer-display">
        <h1>{formatTime(timeLeft)}</h1>
        {isPaused && <p style={{ color: 'gray', fontStyle: 'italic' }}>(Paused)</p>}
      </div>

      <div className="timer-controls">
        {timeLeft > 0 && (
          <>
            <button onClick={togglePause}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button onClick={resetTimer}>
              🔄 Reset
            </button>
          </>
        )}
        <button onClick={onStop}>🟥 Stop</button>
      </div>
    </div>
  );
}

export default TimerScreen;