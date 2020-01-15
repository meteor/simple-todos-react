import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
import { TaskForm } from './TaskForm';

const toggleChecked = ({ _id, isChecked }) => {
  Tasks.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};

const deleteTask = ({ _id }) => Tasks.remove(_id);

const App = () => {
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <ul>
        { tasks.map(task => <Task
          key={ task._id }
          task={ task }
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask}
        />) }
      </ul>

      <TaskForm/>
    </div>
  );
};

export default App;
