import React from 'react';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
import { useTracker } from 'meteor/react-meteor-data';

const renderTasks = tasks => tasks.map(task => <Task key={ task._id } task={ task }/>);

const App = () => {
  const tasks = useTracker(() => Tasks.find({}).fetch());

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      { renderTasks(tasks) }
    </div>
  );
};

export default App;
