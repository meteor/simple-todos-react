# Step 3: Forms and Events

[//]: # (head-end)


All apps need to allow the user to perform some types of interaction with the data that is stored. In our case, the first type of interaction is to insert new tasks, or our app would not have much value, would it?

One of the main ways in which a user can insert or edit data in a website is through forms, in most cases it is a good idea to use the `<form>` tag since it gives semantic meaning to the elements inside it.

## Step 3.1: Create Task Form

First we need to create a simple form component to encapsulate our logic. As you can see we set up the `useState` React Hook.

Please note the _array destructuring_ `[text, setText]`, where `text` is the stored value which we want to use, which in this case will be a _string_; and `setText` is a _function_ used to update that value.

[{]: <helper> (diffStep 3.1 files="imports/ui/TaskForm.jsx" noTitle=true)

##### Added imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊import React, { useState } from 'react';
+┊  ┊ 2┊
+┊  ┊ 3┊export const TaskForm = () => {
+┊  ┊ 4┊  const [text, setText] = useState("");
+┊  ┊ 5┊
+┊  ┊ 6┊  return (
+┊  ┊ 7┊    <form className="task-form">
+┊  ┊ 8┊      <input
+┊  ┊ 9┊        type="text"
+┊  ┊10┊        placeholder="Type to add new tasks"
+┊  ┊11┊      />
+┊  ┊12┊
+┊  ┊13┊      <button type="submit">Add Task</button>
+┊  ┊14┊    </form>
+┊  ┊15┊  );
+┊  ┊16┊};
```

[}]: #

Then we can simply add this to our `App` component:

[{]: <helper> (diffStep 3.1 files="imports/ui/App.jsx" noTitle=true)

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

[}]: #

You also can style it, for now we only need some margin at the top so the form doesn't seem a little off the mark.

[{]: <helper> (diffStep 3.1 files="client/main.css" noTitle=true)

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

[}]: #

## Step 3.2: Add Submit Handler

Now we can attach our submit handler to our form using the `onSubmit` event; and also plug our React Hook into the `onChange` event present in our input element.

As you can see we are using the `useState` React Hook to store the `value` of our `<input>` element. Note that we also need to set our `value` attribute to the `text` constant as well, this will allow the `input`element to stay in sync with our hook.

> In more complex applications you might want to implement some `debounce` or `throttle` logic if there are too many calculations happening between potentially frequent events like `onChange`. There are libraries which will help you with this, like [Lodash](https://lodash.com/), for instance.

[{]: <helper> (diffStep 3.2 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -1,13 +1,27 @@
 ┊ 1┊ 1┊import React, { useState } from 'react';
+┊  ┊ 2┊import Tasks from '/imports/api/tasks';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊export const TaskForm = () => {
 ┊ 4┊ 5┊  const [text, setText] = useState("");
 ┊ 5┊ 6┊
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
+┊  ┊17┊
 ┊ 6┊18┊  return (
-┊ 7┊  ┊    <form className="task-form">
+┊  ┊19┊    <form className="task-form" onSubmit={handleSubmit}>
 ┊ 8┊20┊      <input
 ┊ 9┊21┊        type="text"
 ┊10┊22┊        placeholder="Type to add new tasks"
+┊  ┊23┊        value={text}
+┊  ┊24┊        onChange={(e) => setText(e.target.value)}
 ┊11┊25┊      />
 ┊12┊26┊
 ┊13┊27┊      <button type="submit">Add Task</button>
```

[}]: #

## Step 3.3: Show Newest Tasks First

Now we just need to make a change which will make our hypothetical user very happy: we need to show the newest tasks first. We can accomplish quite quickly by sorting our [Mongo](https://guide.meteor.com/collections.html#mongo-collections) query.

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

| [< Previous Step](step2.md) | [Next Step >](step4.md) |
|:--------------------------------|--------------------------------:|

[}]: #
