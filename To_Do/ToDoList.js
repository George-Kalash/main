
import React, { useState } from 'react';
import Task from './Task';

const ToDoList = () => {
  const [tasks, setTasks] = useState([{ id: 1 }]);

  const addTask = () => {
    const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    setTasks([...tasks, { id: newId }]);
  };

  return (
    <div>
      <div className="header">To-Do List</div>
      <ul className="ToDoList">
        {tasks.map(task => (
          <Task key={task.id} id={task.id} onAddTask={addTask} />
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;