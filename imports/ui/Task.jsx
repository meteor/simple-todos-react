import React from 'react';
import classnames from 'classnames';

export const Task = ({ task, onCheckboxClick, onDeleteClick, onTogglePrivateClick }) => {
  const classes = classnames('task', {
    'checked': Boolean(task.isChecked)
  });

  return (
    <li className={classes}>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <button onClick={ () => onTogglePrivateClick(task) }>{ task.isPrivate ? 'Private' : 'Public' }</button>
      <span>{ task.text } { task.username && <i>({ task.username })</i> }</span>
      <input
        type="checkbox"
        checked={ Boolean(task.isChecked) }
        onClick={ () => onCheckboxClick(task) }
        readOnly
      />
    </li>
  );
};
