# Step 4: Update and Remove Tasks

[//]: # (head-end)


Up until now we have only inserted documents into our collection. Let's take a look at how we can update and remove them by interacting with the user interface.

## Step 4.1: Add Checkbox

First, we need to add a `<checkbox>` element to our `Task` component.

> Be sure to add the `readOnly` attribute since we are not using `onChange` to update the state.

> We also have to force our `checked` prop to a `boolean` since React understands that an `undefined` value as inexistent, therefore causing the component to switch from uncontrolled to a controlled one.

> You are also invited to experient and see how the app behaves for learning purposes.

[{]: <helper> (diffStep 4.1 noTitle=true files="imports/ui/Task.jsx")

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,5 +1,15 @@
 ┊ 1┊ 1┊import React from 'react';
 ┊ 2┊ 2┊
-┊ 3┊  ┊export const Task = ({ task }) => {
-┊ 4┊  ┊  return <li>{task.text}</li>
+┊  ┊ 3┊export const Task = ({ task, onCheckboxClick }) => {
+┊  ┊ 4┊  return (
+┊  ┊ 5┊    <li>
+┊  ┊ 6┊      <input
+┊  ┊ 7┊        type="checkbox"
+┊  ┊ 8┊        checked={ Boolean(task.isChecked) }
+┊  ┊ 9┊        onClick={ () => onCheckboxClick(task) }
+┊  ┊10┊        readOnly
+┊  ┊11┊      />
+┊  ┊12┊      <span>{ task.text }</span>
+┊  ┊13┊    </li>
+┊  ┊14┊  );
 ┊ 5┊15┊};
```

[}]: #

Now we can update our task document toggling its state from `checked: false` to `checked: true` and vice-versa.

[{]: <helper> (diffStep 4.1 noTitle=true files="imports/ui/App.jsx")

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -4,6 +4,14 @@
 ┊ 4┊ 4┊import Tasks from '/imports/api/tasks';
 ┊ 5┊ 5┊import { TaskForm } from './TaskForm';
 ┊ 6┊ 6┊
+┊  ┊ 7┊const toggleChecked = ({ _id, isChecked }) => {
+┊  ┊ 8┊  Tasks.update(_id, {
+┊  ┊ 9┊    $set: {
+┊  ┊10┊      isChecked: !isChecked
+┊  ┊11┊    }
+┊  ┊12┊  })
+┊  ┊13┊};
+┊  ┊14┊
 ┊ 7┊15┊const App = () => {
 ┊ 8┊16┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 ┊ 9┊17┊
```
```diff
@@ -12,7 +20,7 @@
 ┊12┊20┊      <h1>Welcome to Meteor!</h1>
 ┊13┊21┊
 ┊14┊22┊      <ul>
-┊15┊  ┊        { tasks.map(task => <Task key={ task._id } task={ task }/>) }
+┊  ┊23┊        { tasks.map(task => <Task key={ task._id } task={ task } onCheckboxClick={toggleChecked} />) }
 ┊16┊24┊      </ul>
 ┊17┊25┊
 ┊18┊26┊      <TaskForm/>
```

[}]: #

## Step 4.2: Add Delete Button

We can remove our task with just a few lines of code.

[{]: <helper> (diffStep 4.2 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -12,6 +12,8 @@
 ┊12┊12┊  })
 ┊13┊13┊};
 ┊14┊14┊
+┊  ┊15┊const deleteTask = ({ _id }) => Tasks.remove(_id);
+┊  ┊16┊
 ┊15┊17┊const App = () => {
 ┊16┊18┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 ┊17┊19┊
```
```diff
@@ -20,7 +22,12 @@
 ┊20┊22┊      <h1>Welcome to Meteor!</h1>
 ┊21┊23┊
 ┊22┊24┊      <ul>
-┊23┊  ┊        { tasks.map(task => <Task key={ task._id } task={ task } onCheckboxClick={toggleChecked} />) }
+┊  ┊25┊        { tasks.map(task => <Task
+┊  ┊26┊          key={ task._id }
+┊  ┊27┊          task={ task }
+┊  ┊28┊          onCheckboxClick={toggleChecked}
+┊  ┊29┊          onDeleteClick={deleteTask}
+┊  ┊30┊        />) }
 ┊24┊31┊      </ul>
 ┊25┊32┊
 ┊26┊33┊      <TaskForm/>
```

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,8 +1,9 @@
 ┊1┊1┊import React from 'react';
 ┊2┊2┊
-┊3┊ ┊export const Task = ({ task, onCheckboxClick }) => {
+┊ ┊3┊export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
 ┊4┊4┊  return (
 ┊5┊5┊    <li>
+┊ ┊6┊      <button onClick={ () => onDeleteClick(task) }>&times;</button>
 ┊6┊7┊      <input
 ┊7┊8┊        type="checkbox"
 ┊8┊9┊        checked={ Boolean(task.isChecked) }
```

[}]: #

## Step 4.3: Add Styling

Our user interface up until this point has looked quite ugly. Let's add some basic styling which will serve as the foundation for a more professional looking app.

First, let's install the `classnames` package which helps us manage conditional styling:

```shell script
npm i classnames
```

[{]: <helper> (diffStep 4.3 noTitle=true files="package.json")

##### Changed package.json
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊  },
 ┊10┊10┊  "dependencies": {
 ┊11┊11┊    "@babel/runtime": "^7.6.0",
+┊  ┊12┊    "classnames": "^2.2.6",
 ┊12┊13┊    "meteor-node-stubs": "^1.0.0",
 ┊13┊14┊    "react": "^16.9.0",
 ┊14┊15┊    "react-dom": "^16.9.0"
```

[}]: #

If our task is `checked` then the respective class will be applied to it.

[{]: <helper> (diffStep 4.3 noTitle=true files="imports/ui/Task.jsx")

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,16 +1,21 @@
 ┊ 1┊ 1┊import React from 'react';
+┊  ┊ 2┊import classnames from 'classnames';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
+┊  ┊ 5┊  const classes = classnames('task', {
+┊  ┊ 6┊    'checked': Boolean(task.isChecked)
+┊  ┊ 7┊  });
+┊  ┊ 8┊
 ┊ 4┊ 9┊  return (
-┊ 5┊  ┊    <li>
+┊  ┊10┊    <li className={classes}>
 ┊ 6┊11┊      <button onClick={ () => onDeleteClick(task) }>&times;</button>
+┊  ┊12┊      <span>{ task.text }</span>
 ┊ 7┊13┊      <input
 ┊ 8┊14┊        type="checkbox"
 ┊ 9┊15┊        checked={ Boolean(task.isChecked) }
 ┊10┊16┊        onClick={ () => onCheckboxClick(task) }
 ┊11┊17┊        readOnly
 ┊12┊18┊      />
-┊13┊  ┊      <span>{ task.text }</span>
 ┊14┊19┊    </li>
 ┊15┊20┊  );
 ┊16┊21┊};
```

[}]: #

Let's add proper classes to our parent elements.

[{]: <helper> (diffStep 4.3 noTitle=true files="imports/ui/App.jsx")

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -18,10 +18,10 @@
 ┊18┊18┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 ┊19┊19┊
 ┊20┊20┊  return (
-┊21┊  ┊    <div>
+┊  ┊21┊    <div className="simple-todos-react">
 ┊22┊22┊      <h1>Welcome to Meteor!</h1>
 ┊23┊23┊
-┊24┊  ┊      <ul>
+┊  ┊24┊      <ul className="tasks">
 ┊25┊25┊        { tasks.map(task => <Task
 ┊26┊26┊          key={ task._id }
 ┊27┊27┊          task={ task }
```

[}]: #

Finally, we add the CSS styling which will normalize and differentiate our checked tasks visually.

> You can learn more about CSS Flexible Box Module [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox).

[{]: <helper> (diffStep 4.3 noTitle=true files="client/main.css")

##### Changed client&#x2F;main.css
```diff
@@ -3,6 +3,43 @@
 ┊ 3┊ 3┊  font-family: sans-serif;
 ┊ 4┊ 4┊}
 ┊ 5┊ 5┊
-┊ 6┊  ┊.task-form {
+┊  ┊ 6┊.simple-todos-react {
+┊  ┊ 7┊  margin: 0 auto;
+┊  ┊ 8┊  max-width: 512px;
+┊  ┊ 9┊}
+┊  ┊10┊
+┊  ┊11┊.simple-todos-react .tasks {
+┊  ┊12┊  padding: 0;
+┊  ┊13┊  margin: 0;
+┊  ┊14┊  list-style: none;
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊.simple-todos-react .tasks .task {
+┊  ┊18┊  display: flex;
+┊  ┊19┊  align-items: center;
+┊  ┊20┊  height: 32px;
+┊  ┊21┊}
+┊  ┊22┊
+┊  ┊23┊.simple-todos-react .tasks .task span {
+┊  ┊24┊  flex-grow: 1;
+┊  ┊25┊}
+┊  ┊26┊
+┊  ┊27┊.simple-todos-react .tasks .task button {
+┊  ┊28┊  cursor: pointer;
+┊  ┊29┊  background: transparent;
+┊  ┊30┊  outline: none;
+┊  ┊31┊  border: none;
+┊  ┊32┊}
+┊  ┊33┊
+┊  ┊34┊.simple-todos-react .tasks .task.checked span {
+┊  ┊35┊  text-decoration: line-through;
+┊  ┊36┊}
+┊  ┊37┊
+┊  ┊38┊.simple-todos-react .task-form {
 ┊ 7┊39┊  margin-top: 1rem;
+┊  ┊40┊  display: flex;
+┊  ┊41┊}
+┊  ┊42┊
+┊  ┊43┊.simple-todos-react .task-form input {
+┊  ┊44┊  flex-grow: 1;
 ┊ 8┊45┊}
```

[}]: #

Now we have a proper style foundation, nothing fancy, but we have the right semantics in place.





[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|

[}]: #
