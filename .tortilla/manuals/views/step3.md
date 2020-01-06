# Step 3: Forms and Events

[//]: # (head-end)


All apps need to allow the user to perform some types of interaction with the data that is stored. In our case, the first type of interaction is to insert new tasks, or our app would not have much value, would it?

One of the main ways in which a user can insert or edit data in a website is through forms, in most cases it is a good idea to use the `<form>` tag since it gives semantic meaning to the elements inside it.

## Step 3.1: Create Task Form

[{]: <helper> (diffStep 3.1 noTitle=true)

##### Changed client&#x2F;main.css
```diff
@@ -2,3 +2,7 @@
 ┊2┊2┊  padding: 10px;
 ┊3┊3┊  font-family: sans-serif;
 ┊4┊4┊}
+┊ ┊5┊
+┊ ┊6┊.task-form {
+┊ ┊7┊  margin-top: 1rem;
+┊ ┊8┊}
```

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import { useTracker } from 'meteor/react-meteor-data';
 ┊3┊3┊import { Task } from './Task';
 ┊4┊4┊import Tasks from '/imports/api/tasks';
+┊ ┊5┊import { TaskForm } from './TaskForm';
 ┊5┊6┊
 ┊6┊7┊const App = () => {
 ┊7┊8┊  const tasks = useTracker(() => Tasks.find({}).fetch());
```
```diff
@@ -13,6 +14,8 @@
 ┊13┊14┊      <ul>
 ┊14┊15┊        { tasks.map(task => <Task key={ task._id } task={ task }/>) }
 ┊15┊16┊      </ul>
+┊  ┊17┊
+┊  ┊18┊      <TaskForm/>
 ┊16┊19┊    </div>
 ┊17┊20┊  );
 ┊18┊21┊};
```

##### Added imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import React, { useRef } from 'react';
+┊  ┊ 2┊
+┊  ┊ 3┊export const TaskForm = () => {
+┊  ┊ 4┊  const inputRef = useRef(null);
+┊  ┊ 5┊
+┊  ┊ 6┊  return (
+┊  ┊ 7┊    <form className="task-form">
+┊  ┊ 8┊      <input
+┊  ┊ 9┊        type="text"
+┊  ┊10┊        ref={inputRef}
+┊  ┊11┊        placeholder="Type to add new tasks"
+┊  ┊12┊      />
+┊  ┊13┊
+┊  ┊14┊      <button type="submit">Add Task</button>
+┊  ┊15┊    </form>
+┊  ┊16┊  );
+┊  ┊17┊};
```

[}]: #

## Step 3.2: Add Submit Handler

[{]: <helper> (diffStep 3.2 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -1,14 +1,27 @@
-┊ 1┊  ┊import React, { useRef } from 'react';
+┊  ┊ 1┊import React, { useState } from 'react';
+┊  ┊ 2┊import Tasks from '/imports/api/tasks';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊export const TaskForm = () => {
-┊ 4┊  ┊  const inputRef = useRef(null);
+┊  ┊ 5┊  const [text, setText] = useState("");
+┊  ┊ 6┊
+┊  ┊ 7┊  const handleSubmit = () => {
+┊  ┊ 8┊    if (!text) return;
+┊  ┊ 9┊
+┊  ┊10┊    Tasks.insert({
+┊  ┊11┊      text: text.trim(),
+┊  ┊12┊      createdAt: new Date()
+┊  ┊13┊    });
+┊  ┊14┊
+┊  ┊15┊    setText("");
+┊  ┊16┊  };
 ┊ 5┊17┊
 ┊ 6┊18┊  return (
-┊ 7┊  ┊    <form className="task-form">
+┊  ┊19┊    <form className="task-form" onSubmit={handleSubmit}>
 ┊ 8┊20┊      <input
 ┊ 9┊21┊        type="text"
-┊10┊  ┊        ref={inputRef}
 ┊11┊22┊        placeholder="Type to add new tasks"
+┊  ┊23┊        value={text}
+┊  ┊24┊        onChange={(e) => setText(e.target.value)}
 ┊12┊25┊      />
 ┊13┊26┊
 ┊14┊27┊      <button type="submit">Add Task</button>
```

[}]: #

## Step 3.3: Show Newest Tasks First

[{]: <helper> (diffStep 3.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -5,7 +5,7 @@
 ┊ 5┊ 5┊import { TaskForm } from './TaskForm';
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊const App = () => {
-┊ 8┊  ┊  const tasks = useTracker(() => Tasks.find({}).fetch());
+┊  ┊ 8┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 ┊ 9┊ 9┊
 ┊10┊10┊  return (
 ┊11┊11┊    <div>
```

[}]: #


[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step2.md) |
|:----------------------|

[}]: #
