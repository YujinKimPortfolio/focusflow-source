// TaskList.js
// I made this file to be a simple React component that renders the list of tasks on the main screen.
// I wanted this component to stay clean and only focus on looping through tasks and showing each task as a TaskItem. If there are no tasks, I show a message encouraging the user to add one.
import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onTaskEdit, onTaskDelete, onTaskStart, categories }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-tasks">
        {/*  this is the message I mentioned above! */}
        <p>No tasks to display. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            onStart={onTaskStart}
            categories={categories}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
