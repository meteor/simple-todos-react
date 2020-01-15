import React from 'react';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <li>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <input
        type="checkbox"
        checked={ Boolean(task.isChecked) }
        onClick={ () => onCheckboxClick(task) }
        readOnly
      />
      <span>{ task.text }</span>
    </li>
  );
};
