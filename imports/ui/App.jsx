import React from 'react';
import Hello from './Hello.jsx';
import Info from './Info.jsx';

const tasks = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];

const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
  </div>
);

export default App;
