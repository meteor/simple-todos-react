import React, { useState } from 'react';
import Tasks from '/imports/api/tasks';

export const TaskForm = ({ user }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text) return;

    Tasks.insert({
      text: text.trim(),
      createdAt: new Date(),
      owner: user._id,
    });

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};
