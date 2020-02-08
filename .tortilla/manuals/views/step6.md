# Step 6: User Accounts

[//]: # (head-end)


## Step 6.1: Password Authentication

Meteor already comes with a basic authentication and account management system out of the box, so we only need to run a single command to enable username and password authentication:

```
meteor add accounts-password
```

> There are many more authentication methods supported. You can read more about the accounts system [here](https://docs.meteor.com/api/accounts.html).

[{]: <helper> (diffStep 6.1 files=".meteor/packages" noTitle=true)

##### Changed .meteor&#x2F;packages
```diff
@@ -20,3 +20,4 @@
 ┊20┊20┊insecure@1.0.7                # Allow all DB writes from clients (for prototyping)
 ┊21┊21┊static-html             # Define static page content in .html files
 ┊22┊22┊react-meteor-data       # React higher-order component for reactively tracking Meteor data
+┊  ┊23┊accounts-password
```

[}]: #

## Step 6.2: Install BCrypt

You might get a warning saying that you are using a pure-JavaScript implementation of _bcrypt_. To fix that you can just run the following command:

```
meteor npm install bcrypt
```

[{]: <helper> (diffStep 6.2 files="package.json" noTitle=true)

##### Changed package.json
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊  },
 ┊10┊10┊  "dependencies": {
 ┊11┊11┊    "@babel/runtime": "^7.6.0",
+┊  ┊12┊    "bcrypt": "^3.0.8",
 ┊12┊13┊    "classnames": "^2.2.6",
 ┊13┊14┊    "lodash": "^4.17.15",
 ┊14┊15┊    "meteor-node-stubs": "^1.0.0",
```

[}]: #

## Step 6.3: Create User Account

Now we can create a default user for our app, if we do not find the `meteorite` username, we just create a new one.

[{]: <helper> (diffStep 6.3 noTitle=true)

##### Changed server&#x2F;main.js
```diff
@@ -11,6 +11,13 @@
 ┊11┊11┊}
 ┊12┊12┊
 ┊13┊13┊Meteor.startup(() => {
+┊  ┊14┊  if (!Accounts.findUserByUsername('meteorite')) {
+┊  ┊15┊    Accounts.createUser({
+┊  ┊16┊      username: 'meteorite',
+┊  ┊17┊      password: 'password'
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊
 ┊14┊21┊  if (Tasks.find().count() === 0) {
 ┊15┊22┊    [
 ┊16┊23┊      'First Task',
```

[}]: #

## Step 6.4: Login Form

We need to input the credentials and authenticate the user at some point, for that we need a form.

We can implement a very simple one using `useState` hooks.

[{]: <helper> (diffStep 6.4 noTitle=true)

##### Added imports&#x2F;ui&#x2F;LoginForm.jsx
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊import React, { useState } from 'react';
+┊  ┊ 2┊
+┊  ┊ 3┊export const LoginForm = () => {
+┊  ┊ 4┊  const [username, setUsername] = useState('');
+┊  ┊ 5┊  const [password, setPassword] = useState('');
+┊  ┊ 6┊
+┊  ┊ 7┊  const submit = (e) => {
+┊  ┊ 8┊    e.preventDefault();
+┊  ┊ 9┊
+┊  ┊10┊    Meteor.loginWithPassword(username, password);
+┊  ┊11┊  };
+┊  ┊12┊
+┊  ┊13┊  return (
+┊  ┊14┊    <form onSubmit={submit} className="login-form">
+┊  ┊15┊      <label htmlFor="username">Username</label>
+┊  ┊16┊
+┊  ┊17┊      <input
+┊  ┊18┊          type="text"
+┊  ┊19┊          placeholder="Username"
+┊  ┊20┊          name="username"
+┊  ┊21┊          required
+┊  ┊22┊
+┊  ┊23┊          onChange={(e) => setUsername(e.currentTarget.value)}
+┊  ┊24┊      />
+┊  ┊25┊
+┊  ┊26┊      <label htmlFor="password">Password</label>
+┊  ┊27┊
+┊  ┊28┊      <input
+┊  ┊29┊          type="password"
+┊  ┊30┊          placeholder="Password"
+┊  ┊31┊          name="password"
+┊  ┊32┊          required
+┊  ┊33┊
+┊  ┊34┊          onChange={(e) => setPassword(e.currentTarget.value)}
+┊  ┊35┊      />
+┊  ┊36┊
+┊  ┊37┊      <button type="submit">Log In</button>
+┊  ┊38┊    </form>
+┊  ┊39┊  );
+┊  ┊40┊};
```

[}]: #

## Step 6.5: Require Authentication

Our app should only allow an authenticated user to access its task management features.

We can accomplish that quite easily.

[{]: <helper> (diffStep 6.5 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { Task } from './Task';
 ┊ 5┊ 5┊import Tasks from '/imports/api/tasks';
 ┊ 6┊ 6┊import { TaskForm } from './TaskForm';
+┊  ┊ 7┊import { LoginForm } from './LoginForm';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊const toggleChecked = ({ _id, isChecked }) => {
 ┊ 9┊10┊  Tasks.update(_id, {
```
```diff
@@ -24,11 +25,20 @@
 ┊24┊25┊    _.set(filter, 'checked', false);
 ┊25┊26┊  }
 ┊26┊27┊
-┊27┊  ┊  const { tasks, incompleteTasksCount } = useTracker(() => ({
+┊  ┊28┊  const { tasks, incompleteTasksCount, user } = useTracker(() => ({
 ┊28┊29┊    tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
-┊29┊  ┊    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count()
+┊  ┊30┊    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count(),
+┊  ┊31┊    user: Meteor.user(),
 ┊30┊32┊  }));
 ┊31┊33┊
+┊  ┊34┊  if (!user) {
+┊  ┊35┊    return (
+┊  ┊36┊      <div className="simple-todos-react">
+┊  ┊37┊        <LoginForm/>
+┊  ┊38┊      </div>
+┊  ┊39┊    );
+┊  ┊40┊  }
+┊  ┊41┊
 ┊32┊42┊  return (
 ┊33┊43┊    <div className="simple-todos-react">
 ┊34┊44┊      <h1>Todo List ({ incompleteTasksCount })</h1>
```

[}]: #

## Step 6.6: Basic Styling

Now we add some basic styling, so our app gets more welcoming.

[{]: <helper> (diffStep 6.6 noTitle=true)

##### Changed client&#x2F;main.css
```diff
@@ -47,3 +47,26 @@
 ┊47┊47┊.simple-todos-react .task-form input {
 ┊48┊48┊  flex-grow: 1;
 ┊49┊49┊}
+┊  ┊50┊
+┊  ┊51┊.simple-todos-react .login-form {
+┊  ┊52┊  margin-top: 2rem;
+┊  ┊53┊}
+┊  ┊54┊
+┊  ┊55┊.simple-todos-react .login-form label,
+┊  ┊56┊.simple-todos-react .login-form input {
+┊  ┊57┊  display: block;
+┊  ┊58┊  width: 100%;
+┊  ┊59┊  box-sizing: border-box;
+┊  ┊60┊}
+┊  ┊61┊
+┊  ┊62┊.simple-todos-react .login-form label {
+┊  ┊63┊  margin-bottom: .4rem;
+┊  ┊64┊}
+┊  ┊65┊
+┊  ┊66┊.simple-todos-react .login-form input {
+┊  ┊67┊  margin-bottom: .8rem;
+┊  ┊68┊}
+┊  ┊69┊
+┊  ┊70┊.simple-todos-react .login-form button[type=submit] {
+┊  ┊71┊  float: right;
+┊  ┊72┊}
```

[}]: #

## Step 6.7: Task Owner

In order to better manage our tasks, every task should have an owner.

[{]: <helper> (diffStep 6.7 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -64,7 +64,7 @@
 ┊64┊64┊        />) }
 ┊65┊65┊      </ul>
 ┊66┊66┊
-┊67┊  ┊      <TaskForm/>
+┊  ┊67┊      <TaskForm user={user}/>
 ┊68┊68┊    </div>
 ┊69┊69┊  );
 ┊70┊70┊};
```

##### Changed imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import React, { useState } from 'react';
 ┊2┊2┊import Tasks from '/imports/api/tasks';
 ┊3┊3┊
-┊4┊ ┊export const TaskForm = () => {
+┊ ┊4┊export const TaskForm = ({ user }) => {
 ┊5┊5┊  const [text, setText] = useState("");
 ┊6┊6┊
 ┊7┊7┊  const handleSubmit = () => {
```
```diff
@@ -9,7 +9,8 @@
 ┊ 9┊ 9┊
 ┊10┊10┊    Tasks.insert({
 ┊11┊11┊      text: text.trim(),
-┊12┊  ┊      createdAt: new Date()
+┊  ┊12┊      createdAt: new Date(),
+┊  ┊13┊      owner: user._id,
 ┊13┊14┊    });
 ┊14┊15┊
 ┊15┊16┊    setText("");
```

[}]: #

## Step 6.8: Task Owner Username

We also can better organize our tasks by showing the username of the owner.

[{]: <helper> (diffStep 6.8 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,15 +1,18 @@
 ┊ 1┊ 1┊import React from 'react';
 ┊ 2┊ 2┊import classnames from 'classnames';
+┊  ┊ 3┊import _ from 'lodash';
 ┊ 3┊ 4┊
 ┊ 4┊ 5┊export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
 ┊ 5┊ 6┊  const classes = classnames('task', {
 ┊ 6┊ 7┊    'checked': Boolean(task.isChecked)
 ┊ 7┊ 8┊  });
 ┊ 8┊ 9┊
+┊  ┊10┊  const owner = _.first(Accounts.users.find(task.owner).fetch());
+┊  ┊11┊
 ┊ 9┊12┊  return (
 ┊10┊13┊    <li className={classes}>
 ┊11┊14┊      <button onClick={ () => onDeleteClick(task) }>&times;</button>
-┊12┊  ┊      <span>{ task.text }</span>
+┊  ┊15┊      <span>{ task.text } { owner && <i>({ owner.username })</i> }</span>
 ┊13┊16┊      <input
 ┊14┊17┊        type="checkbox"
 ┊15┊18┊        checked={ Boolean(task.isChecked) }
```

[}]: #

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step5.md) | [Next Step >](step7.md) |
|:--------------------------------|--------------------------------:|

[}]: #
