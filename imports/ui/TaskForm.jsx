import React, { useRef } from 'react';

export const TaskForm = () => {
  const inputRef = useRef(null);

  return (
    <form className="task-form">
      <input
        type="text"
        ref={inputRef}
        placeholder="Type to add new tasks"
      />

      <button type="submit">Add Task</button>
    </form>
  );
};
