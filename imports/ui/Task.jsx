import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const classes = classnames('task', {
    'checked': Boolean(task.isChecked)
  });

  const owner = _.first(Accounts.users.find(task.owner).fetch());

  return (
    <li className={classes}>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <span>{ task.text } { owner && <i>({ owner.username })</i> }</span>
      <input
        type="checkbox"
        checked={ Boolean(task.isChecked) }
        onClick={ () => onCheckboxClick(task) }
        readOnly
      />
    </li>
  );
};
