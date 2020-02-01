# Step 5: User Interface State

[//]: # (head-end)


In this step we will store some state using React Hooks.

## Step 5.1: Add State Hook

First we need to import the `useState` function from the React library. Afterwards we initialize the hook with `false`.

The `useState` function returns an array pair, where the first element is our value, and the second is a setter function. Hence the _array destructuring_.

Bear in mind that the names used for the constants do not belong to the React API, you can name them whatever you like.

[{]: <helper> (diffStep 5.1 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import React from 'react';
+┊ ┊1┊import React, { useState } from 'react';
 ┊2┊2┊import { useTracker } from 'meteor/react-meteor-data';
 ┊3┊3┊import { Task } from './Task';
 ┊4┊4┊import Tasks from '/imports/api/tasks';
```
```diff
@@ -15,6 +15,8 @@
 ┊15┊15┊const deleteTask = ({ _id }) => Tasks.remove(_id);
 ┊16┊16┊
 ┊17┊17┊const App = () => {
+┊  ┊18┊  const [hideCompleted, setHideCompleted] = useState(false);
+┊  ┊19┊
 ┊18┊20┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 ┊19┊21┊
 ┊20┊22┊  return (
```

[}]: #

You can read more about the `useState` hook [here](https://reactjs.org/docs/hooks-state.html).

## Step 5.2: Add Filtering Checkbox

This is straightforward, but since it quite didn't look right we made some improvements to our styling as well.

> Remember, we use the `Boolean` cast in case we have `undefined` values. We also use the `readOnly` attribute since we are not using `onChange`.

[{]: <helper> (diffStep 5.2 noTitle=true)

##### Changed client&#x2F;main.css
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊body {
-┊2┊ ┊  padding: 10px;
-┊3┊ ┊  font-family: sans-serif;
+┊ ┊2┊  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
+┊ ┊3┊  font-size: 14px;
 ┊4┊4┊}
 ┊5┊5┊
 ┊6┊6┊.simple-todos-react {
```
```diff
@@ -8,6 +8,10 @@
 ┊ 8┊ 8┊  max-width: 512px;
 ┊ 9┊ 9┊}
 ┊10┊10┊
+┊  ┊11┊.simple-todos-react .filters {
+┊  ┊12┊  margin-bottom: 1rem;
+┊  ┊13┊}
+┊  ┊14┊
 ┊11┊15┊.simple-todos-react .tasks {
 ┊12┊16┊  padding: 0;
 ┊13┊17┊  margin: 0;
```

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -23,6 +23,18 @@
 ┊23┊23┊    <div className="simple-todos-react">
 ┊24┊24┊      <h1>Welcome to Meteor!</h1>
 ┊25┊25┊
+┊  ┊26┊      <div className="filters">
+┊  ┊27┊        <label>
+┊  ┊28┊          <input
+┊  ┊29┊              type="checkbox"
+┊  ┊30┊              readOnly
+┊  ┊31┊              checked={ Boolean(hideCompleted) }
+┊  ┊32┊              onClick={() => setHideCompleted(!hideCompleted)}
+┊  ┊33┊          />
+┊  ┊34┊          Hide Completed
+┊  ┊35┊        </label>
+┊  ┊36┊      </div>
+┊  ┊37┊
 ┊26┊38┊      <ul className="tasks">
 ┊27┊39┊        { tasks.map(task => <Task
 ┊28┊40┊          key={ task._id }
```

[}]: #

## Step 5.3: Filter Tasks

Meteor allows you to leverage all Node.js' ecosystem, including a well-known library called Lodash. This library helps us write code in a more declarative manner.

Not strictly necessary in this case, but it is a good idea for us to import only used functions for larger projects since not everything needs to be included in the final bundle files.

So, for simplicity we use `_` to namespace all of Lodash's functions.

Now, if the user has selected the `checkbox` to hide completed tasks, we will include our `checked: false` clause to the query.

[{]: <helper> (diffStep 5.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import React, { useState } from 'react';
 ┊2┊2┊import { useTracker } from 'meteor/react-meteor-data';
+┊ ┊3┊import _ from 'lodash';
 ┊3┊4┊import { Task } from './Task';
 ┊4┊5┊import Tasks from '/imports/api/tasks';
 ┊5┊6┊import { TaskForm } from './TaskForm';
```
```diff
@@ -15,9 +16,15 @@
 ┊15┊16┊const deleteTask = ({ _id }) => Tasks.remove(_id);
 ┊16┊17┊
 ┊17┊18┊const App = () => {
+┊  ┊19┊  const filter = {};
+┊  ┊20┊
 ┊18┊21┊  const [hideCompleted, setHideCompleted] = useState(false);
 ┊19┊22┊
-┊20┊  ┊  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
+┊  ┊23┊  if (hideCompleted) {
+┊  ┊24┊    _.set(filter, 'checked', false);
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  const tasks = useTracker(() => Tasks.find(filter, { sort: { createdAt: -1 } }).fetch());
 ┊21┊28┊
 ┊22┊29┊  return (
 ┊23┊30┊    <div className="simple-todos-react">
```

##### Changed package-lock.json
```diff
@@ -21,6 +21,11 @@
 ┊21┊21┊      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
 ┊22┊22┊      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ=="
 ┊23┊23┊    },
+┊  ┊24┊    "lodash": {
+┊  ┊25┊      "version": "4.17.15",
+┊  ┊26┊      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.15.tgz",
+┊  ┊27┊      "integrity": "sha512-8xOcRHvCjnocdS5cpwXQXVzmmh5e5+saE2QGoeQmbKmRS6J3VQppPOIt0MnmE+4xlZoumy0GPG0D0MVIQbNA1A=="
+┊  ┊28┊    },
 ┊24┊29┊    "loose-envify": {
 ┊25┊30┊      "version": "1.4.0",
 ┊26┊31┊      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
```

##### Changed package.json
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊  "dependencies": {
 ┊11┊11┊    "@babel/runtime": "^7.6.0",
 ┊12┊12┊    "classnames": "^2.2.6",
+┊  ┊13┊    "lodash": "^4.17.15",
 ┊13┊14┊    "meteor-node-stubs": "^1.0.0",
 ┊14┊15┊    "react": "^16.9.0",
 ┊15┊16┊    "react-dom": "^16.9.0"
```

[}]: #

## Step 5.4: Count Incomplete Tasks

We can count our incomplete tasks quite simply with the help of the cursor method `count()`.

[{]: <helper> (diffStep 5.4 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -24,7 +24,10 @@
 ┊24┊24┊    _.set(filter, 'checked', false);
 ┊25┊25┊  }
 ┊26┊26┊
-┊27┊  ┊  const tasks = useTracker(() => Tasks.find(filter, { sort: { createdAt: -1 } }).fetch());
+┊  ┊27┊  const { tasks, incompleteTasksCount } = useTracker(() => ({
+┊  ┊28┊    tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
+┊  ┊29┊    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count()
+┊  ┊30┊  }));
 ┊28┊31┊
 ┊29┊32┊  return (
 ┊30┊33┊    <div className="simple-todos-react">
```

[}]: #

## Step 5.5: Render Count

Finally we just modify our header to display the render count.

[{]: <helper> (diffStep 5.5 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -31,7 +31,7 @@
 ┊31┊31┊
 ┊32┊32┊  return (
 ┊33┊33┊    <div className="simple-todos-react">
-┊34┊  ┊      <h1>Welcome to Meteor!</h1>
+┊  ┊34┊      <h1>Todo List ({ incompleteTasksCount })</h1>
 ┊35┊35┊
 ┊36┊36┊      <div className="filters">
 ┊37┊37┊        <label>
```

[}]: #

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|

[}]: #
