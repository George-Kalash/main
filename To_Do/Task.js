
import React from 'react';

const Task = ({ id, onAddTask }) => {
  return (
    <li id={`task_${id}`} className="taskItem">
      <div className="drag">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="dot" key={index}></div>
        ))}
      </div>
      <input type="text" />
      <button onClick={onAddTask} className="delete">
        {}
        Add Task
      </button>
    </li>
  );
};

export default Task;
