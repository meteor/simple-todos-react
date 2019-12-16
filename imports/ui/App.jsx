import React from 'react';
import { Task } from './Task';


const tasks = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];

const renderTasks = () => tasks.map(task => <Task key={task._id} task={task}/>);

const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    { renderTasks() }
  </div>
);

export default App;
