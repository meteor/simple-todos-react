# Step 2: Collection

[//]: # (head-end)


In order to take advantage of our database and manipulate our data in more powerful ways we need to create a _collection_, which is where we will store our _documents_ or objects.

> You can read more about collections [here](http://guide.meteor.com/collections.html).

In this step we will implement all the necessary code to have a basic tasks collection up and running using React hooks.

## Step 2.1: Create Tasks Collection

We can create a new tasks collection by creating a module at `imports/api/tasks.js` which instantiates a new Mongo collection and exports it.

[{]: <helper> (diffStep 2.1 noTitle=true)

##### Added imports&#x2F;api&#x2F;tasks.js
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊import { Mongo } from 'meteor/mongo';
+┊ ┊2┊
+┊ ┊3┊export default new Mongo.Collection('tasks');
```

[}]: #

Notice that we stored the file in the `imports/api` directory, which is a sensible place to store API-related code, like publications and methods.

You can read more about the app structure [here](http://guide.meteor.com/structure.html).

## Step 2.2: Initialize Tasks Collection

For our collection to work we need to import it in the server so it sets some plumbing up. You can either use `import "/imports/api/tasks"` or `import tasks from "/imports/api/tasks"` if you are going to use on the same file, but make sure it is imported.

Now it is easy to check if there is data or not on our collection, otherwise we can insert some sample data easily as well.

[{]: <helper> (diffStep 2.2 noTitle=true)

##### Changed server&#x2F;main.js
```diff
@@ -1,11 +1,28 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
 ┊ 2┊ 2┊import Links from '/imports/api/links';
+┊  ┊ 3┊import Tasks from '/imports/api/tasks';
 ┊ 3┊ 4┊
 ┊ 4┊ 5┊function insertLink(title, url) {
 ┊ 5┊ 6┊  Links.insert({ title, url, createdAt: new Date() });
 ┊ 6┊ 7┊}
 ┊ 7┊ 8┊
+┊  ┊ 9┊function insertTask(text) {
+┊  ┊10┊  Tasks.insert({ text, createdAt: new Date() });
+┊  ┊11┊}
+┊  ┊12┊
 ┊ 8┊13┊Meteor.startup(() => {
+┊  ┊14┊  if (Tasks.find().count() === 0) {
+┊  ┊15┊    [
+┊  ┊16┊      'First Task',
+┊  ┊17┊      'Second Task',
+┊  ┊18┊      'Third Task',
+┊  ┊19┊      'Fourth Task',
+┊  ┊20┊      'Fifth Task',
+┊  ┊21┊      'Sixth Task',
+┊  ┊22┊      'Seventh Task'
+┊  ┊23┊    ].forEach(insertTask)
+┊  ┊24┊  }
+┊  ┊25┊
 ┊ 9┊26┊  // If the Links collection is empty, add some data.
 ┊10┊27┊  if (Links.find().count() === 0) {
 ┊11┊28┊    insertLink(
```

[}]: #

## Step 2.3: Render Tasks Collection

Now comes the fun part, we will render our tasks using a React Functional Component and a Hook called `useTracker` from a package called `react-meteor-data`, click [here](https://atmospherejs.com/meteor/react-meteor-data) for more information.

> For more information about React Hooks click [here](https://reactjs.org/docs/hooks-faq.html).

[{]: <helper> (diffStep 2.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -1,20 +1,19 @@
 ┊ 1┊ 1┊import React from 'react';
 ┊ 2┊ 2┊import { Task } from './Task';
+┊  ┊ 3┊import Tasks from '/imports/api/tasks';
+┊  ┊ 4┊import { useTracker } from 'meteor/react-meteor-data';
 ┊ 3┊ 5┊
+┊  ┊ 6┊const renderTasks = tasks => tasks.map(task => <Task key={ task._id } task={ task }/>);
 ┊ 4┊ 7┊
-┊ 5┊  ┊const tasks = [
-┊ 6┊  ┊  {_id: 1, text: 'First Task'},
-┊ 7┊  ┊  {_id: 2, text: 'Second Task'},
-┊ 8┊  ┊  {_id: 3, text: 'Third Task'},
-┊ 9┊  ┊];
+┊  ┊ 8┊const App = () => {
+┊  ┊ 9┊  const tasks = useTracker(() => Tasks.find({}).fetch());
 ┊10┊10┊
-┊11┊  ┊const renderTasks = () => tasks.map(task => <Task key={ task._id } task={ task }/>);
-┊12┊  ┊
-┊13┊  ┊const App = () => (
-┊14┊  ┊  <div>
-┊15┊  ┊    <h1>Welcome to Meteor!</h1>
-┊16┊  ┊    { renderTasks() }
-┊17┊  ┊  </div>
-┊18┊  ┊);
+┊  ┊11┊  return (
+┊  ┊12┊    <div>
+┊  ┊13┊      <h1>Welcome to Meteor!</h1>
+┊  ┊14┊      { renderTasks(tasks) }
+┊  ┊15┊    </div>
+┊  ┊16┊  );
+┊  ┊17┊};
 ┊19┊18┊
 ┊20┊19┊export default App;
```

[}]: #

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step1.md) |
|:----------------------|

[}]: #
