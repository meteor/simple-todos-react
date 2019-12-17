import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';

const App = () => {
  const tasks = useTracker(() => Tasks.find({}).fetch());

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <ul>
        { tasks.map(task => <Task key={ task._id } task={ task }/>) }
      </ul>
    </div>
  );
};

export default App;
