# Step 1: Create App

[//]: # (head-end)


In this tutorial we will build a simple to-do tasks app using [React](https://reactjs.org) with the Meteor platform. Meteor works out-of-the-box with several other frameworks like [Blaze](https://guide.meteor.com/blaze.html), [Angular](https://guide.meteor.com/angular.html) and [Vue](https://guide.meteor.com/vue.html).

## Step 1.1: Create Meteor Project

First we need to install Meteor and the easiest way to setup Meteor with React is by using the command:

```shell script
meteor create --react simple-todos-react
```

After this command is run, Meteor will create several boilerplate files for you.

These are the files responsible for bootstrapping your client user interface:

[{]: <helper> (diffStep 1.1 noTitle=true files="client/main.html,client/main.css,client/main.jsx")

##### Added client&#x2F;main.css
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊body {
+┊ ┊2┊  padding: 10px;
+┊ ┊3┊  font-family: sans-serif;
+┊ ┊4┊}
```

##### Added client&#x2F;main.html
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊<head>
+┊ ┊2┊  <title>simple-todos-react</title>
+┊ ┊3┊</head>
+┊ ┊4┊
+┊ ┊5┊<body>
+┊ ┊6┊  <div id="react-target"></div>
+┊ ┊7┊</body>
```

##### Added client&#x2F;main.jsx
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊import React from 'react';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊import { render } from 'react-dom';
+┊ ┊4┊import App from '/imports/ui/App'
+┊ ┊5┊
+┊ ┊6┊Meteor.startup(() => {
+┊ ┊7┊  render(<App />, document.getElementById('react-target'));
+┊ ┊8┊});
```

[}]: #

For now you don't need to worry about the files located in the `client` directory, Meteor has already set them up for you.

You can run your Meteor app using:

```shell script
meteor run
```

Don't worry, Meteor will keep your app in sync with all your changes from now on.

Most of your React application will be located inside the `imports` directory, and this file is the entry point of your React To-do app:

[{]: <helper> (diffStep 1.1 noTitle=true files="imports/ui/App.jsx")

##### Added imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊import React from 'react';
+┊  ┊ 2┊import Hello from './Hello.jsx';
+┊  ┊ 3┊import Info from './Info.jsx';
+┊  ┊ 4┊
+┊  ┊ 5┊const App = () => (
+┊  ┊ 6┊  <div>
+┊  ┊ 7┊    <h1>Welcome to Meteor!</h1>
+┊  ┊ 8┊    <Hello />
+┊  ┊ 9┊    <Info />
+┊  ┊10┊  </div>
+┊  ┊11┊);
+┊  ┊12┊
+┊  ┊13┊export default App;
```

[}]: #

> Note: in previous versions of Meteor, the `imports` directory was special because files outside the `imports` directory were loaded automatically when the application started, whereas files inside the `imports` directory were only loaded when imported using an `import` declaration or a `require` statement. As of Meteor 1.7, the entry point for both client and server JavaScript is determined by the `meteor.mainModule` section in `package.json`. In other words, as far as JavaScript code is concerned, the entire application now behaves as if it was inside an `imports` directory, so you don't need to worry as much about the `imports` directory now.


## Step 1.2: Create Task Component

After we have all the files set, we can create our first React component for our To-Do App.

[{]: <helper> (diffStep 1.2 noTitle=true)

##### Added imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import React from 'react';
+┊ ┊2┊
+┊ ┊3┊export const Task = ({ task }) => {
+┊ ┊4┊  return <li>{task.text}</li>
+┊ ┊5┊};
```

[}]: #

## Step 1.3: Create Sample Tasks

Let's define some sample data which will be used shortly.

[{]: <helper> (diffStep 1.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -2,6 +2,12 @@
 ┊ 2┊ 2┊import Hello from './Hello.jsx';
 ┊ 3┊ 3┊import Info from './Info.jsx';
 ┊ 4┊ 4┊
+┊  ┊ 5┊const tasks = [
+┊  ┊ 6┊  {_id: 1, text: 'First Task'},
+┊  ┊ 7┊  {_id: 2, text: 'Second Task'},
+┊  ┊ 8┊  {_id: 3, text: 'Third Task'},
+┊  ┊ 9┊];
+┊  ┊10┊
 ┊ 5┊11┊const App = () => (
 ┊ 6┊12┊  <div>
 ┊ 7┊13┊    <h1>Welcome to Meteor!</h1>
```

[}]: #


## Step 1.4: Render Sample Tasks

Now we can implement some simple rendering logic with React. We can now use our previous `Task` component to render our list items.

[{]: <helper> (diffStep 1.4 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊import React from 'react';
-┊2┊ ┊import Hello from './Hello.jsx';
-┊3┊ ┊import Info from './Info.jsx';
+┊ ┊2┊import { Task } from './Task';
+┊ ┊3┊
 ┊4┊4┊
 ┊5┊5┊const tasks = [
 ┊6┊6┊  {_id: 1, text: 'First Task'},
```
```diff
@@ -11,8 +11,10 @@
 ┊11┊11┊const App = () => (
 ┊12┊12┊  <div>
 ┊13┊13┊    <h1>Welcome to Meteor!</h1>
-┊14┊  ┊    <Hello />
-┊15┊  ┊    <Info />
+┊  ┊14┊
+┊  ┊15┊    <ul>
+┊  ┊16┊      { tasks.map(task => <Task key={ task._id } task={ task }/>) }
+┊  ┊17┊    </ul>
 ┊16┊18┊  </div>
 ┊17┊19┊);
```

[}]: #

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Intro](../../../README.md) | [Next Step >](step2.md) |
|:--------------------------------|--------------------------------:|

[}]: #
