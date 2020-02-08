# Step 7: Methods &amp; Security

[//]: # (head-end)


Before this step, any user of the app could edit any part of the database. This might be fine for quick prototyping, but real applications need to control access to its data.

In Meteor, the easiest way to accomplish that is by declaring _methods_, instead of calling `insert`, `update`, or `remove` directly.

With methods, you can verify if the user is authenticated and authorized to perform certain actions and then change the database accordingly.

> You can read more about Methods [here](https://guide.meteor.com/methods.html).

## Step 7.1: Disable Quick Prototyping

Every newly created Meteor project has the `insecure` package installed by default.

This package allows us to edit the database from the client, which is useful for quick prototyping.

We need to remove it, because as the name suggests it is `insecure`.

```
meteor remove insecure
```

[{]: <helper> (diffStep 7.1 noTitle=true)

##### Changed .meteor&#x2F;packages
```diff
@@ -17,7 +17,6 @@
 ┊17┊17┊shell-server@0.4.0            # Server-side component of the `meteor shell` command
 ┊18┊18┊
 ┊19┊19┊autopublish@1.0.7             # Publish all data to the clients (for prototyping)
-┊20┊  ┊insecure@1.0.7                # Allow all DB writes from clients (for prototyping)
 ┊21┊20┊static-html             # Define static page content in .html files
 ┊22┊21┊react-meteor-data       # React higher-order component for reactively tracking Meteor data
 ┊23┊22┊accounts-password
```

##### Changed .meteor&#x2F;versions
```diff
@@ -34,7 +34,6 @@
 ┊34┊34┊html-tools@1.0.11
 ┊35┊35┊htmljs@1.0.11
 ┊36┊36┊id-map@1.1.0
-┊37┊  ┊insecure@1.0.7
 ┊38┊37┊inter-process-messaging@0.1.0
 ┊39┊38┊launch-screen@1.1.1
 ┊40┊39┊livedata@1.0.18
```

[}]: #

Now our app does not work anymore. We revoked all client-side database permissions.

## Step 7.2: Add Task Methods

Now we need to define methods.

We need one method for each database operation we want to perform on the client.

Methods should be defined in code executed both in the client, and the server for Optimistic UI support.

### Optimistic UI

When we call a method on the client using `Meteor.call`, two things happen in parallel:

1. The client sends a request to the sever to run the method in a secure environment.
2. A simulation of the method runs directly on the client trying to predict the outcome of the call.

This means that a newly created task actually appears on the screen before the result comes back from the server.

If the result matches that of the server everything remains as is, otherwise the UI gets patched to reflect the actual state of the server.

> You can read more about Optimistic UI [here](https://blog.meteor.com/optimistic-ui-with-meteor-67b5a78c3fcf).

[{]: <helper> (diffStep 7.2 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.js
```diff
@@ -1,3 +1,46 @@
 ┊ 1┊ 1┊import { Mongo } from 'meteor/mongo';
+┊  ┊ 2┊import { check } from 'meteor/check';
 ┊ 2┊ 3┊
-┊ 3┊  ┊export default new Mongo.Collection('tasks');
+┊  ┊ 4┊export const Tasks = new Mongo.Collection('tasks');
+┊  ┊ 5┊
+┊  ┊ 6┊Meteor.methods({
+┊  ┊ 7┊  'tasks.insert'(text) {
+┊  ┊ 8┊    check(text, String);
+┊  ┊ 9┊
+┊  ┊10┊    if (!this.userId) {
+┊  ┊11┊      throw new Meteor.Error('Not authorized.');
+┊  ┊12┊    }
+┊  ┊13┊
+┊  ┊14┊    Tasks.insert({
+┊  ┊15┊      text,
+┊  ┊16┊      createdAt: new Date,
+┊  ┊17┊      owner: this.userId,
+┊  ┊18┊      username: Meteor.users.findOne(this.userId).username
+┊  ┊19┊    })
+┊  ┊20┊  },
+┊  ┊21┊
+┊  ┊22┊  'tasks.remove'(taskId) {
+┊  ┊23┊    check(taskId, String);
+┊  ┊24┊
+┊  ┊25┊    if (!this.userId) {
+┊  ┊26┊      throw new Meteor.Error('Not authorized.');
+┊  ┊27┊    }
+┊  ┊28┊
+┊  ┊29┊    Tasks.remove(taskId);
+┊  ┊30┊  },
+┊  ┊31┊
+┊  ┊32┊  'tasks.setChecked'(taskId, isChecked) {
+┊  ┊33┊    check(taskId, String);
+┊  ┊34┊    check(isChecked, Boolean);
+┊  ┊35┊
+┊  ┊36┊    if (!this.userId) {
+┊  ┊37┊      throw new Meteor.Error('Not authorized.');
+┊  ┊38┊    }
+┊  ┊39┊
+┊  ┊40┊    Tasks.update(taskId, {
+┊  ┊41┊      $set: {
+┊  ┊42┊        isChecked
+┊  ┊43┊      }
+┊  ┊44┊    });
+┊  ┊45┊  }
+┊  ┊46┊});🚫↵
```

[}]: #

## Step 7.3: Implement Method Calls

As we have defined our methods, we need to update the places we were operating the collection to use them instead.

[{]: <helper> (diffStep 7.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -2,19 +2,15 @@
 ┊ 2┊ 2┊import { useTracker } from 'meteor/react-meteor-data';
 ┊ 3┊ 3┊import _ from 'lodash';
 ┊ 4┊ 4┊import { Task } from './Task';
-┊ 5┊  ┊import Tasks from '/imports/api/tasks';
+┊  ┊ 5┊import { Tasks } from '/imports/api/tasks';
 ┊ 6┊ 6┊import { TaskForm } from './TaskForm';
 ┊ 7┊ 7┊import { LoginForm } from './LoginForm';
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊const toggleChecked = ({ _id, isChecked }) => {
-┊10┊  ┊  Tasks.update(_id, {
-┊11┊  ┊    $set: {
-┊12┊  ┊      isChecked: !isChecked
-┊13┊  ┊    }
-┊14┊  ┊  })
+┊  ┊10┊  Meteor.call('tasks.setChecked', _id, !isChecked);
 ┊15┊11┊};
 ┊16┊12┊
-┊17┊  ┊const deleteTask = ({ _id }) => Tasks.remove(_id);
+┊  ┊13┊const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
 ┊18┊14┊
 ┊19┊15┊const App = () => {
 ┊20┊16┊  const filter = {};
```
```diff
@@ -64,7 +60,7 @@
 ┊64┊60┊        />) }
 ┊65┊61┊      </ul>
 ┊66┊62┊
-┊67┊  ┊      <TaskForm user={user}/>
+┊  ┊63┊      <TaskForm />
 ┊68┊64┊    </div>
 ┊69┊65┊  );
 ┊70┊66┊};
```

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,18 +1,15 @@
 ┊ 1┊ 1┊import React from 'react';
 ┊ 2┊ 2┊import classnames from 'classnames';
-┊ 3┊  ┊import _ from 'lodash';
 ┊ 4┊ 3┊
 ┊ 5┊ 4┊export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
 ┊ 6┊ 5┊  const classes = classnames('task', {
 ┊ 7┊ 6┊    'checked': Boolean(task.isChecked)
 ┊ 8┊ 7┊  });
 ┊ 9┊ 8┊
-┊10┊  ┊  const owner = _.first(Accounts.users.find(task.owner).fetch());
-┊11┊  ┊
 ┊12┊ 9┊  return (
 ┊13┊10┊    <li className={classes}>
 ┊14┊11┊      <button onClick={ () => onDeleteClick(task) }>&times;</button>
-┊15┊  ┊      <span>{ task.text } { owner && <i>({ owner.username })</i> }</span>
+┊  ┊12┊      <span>{ task.text } { task.username && <i>({ task.username })</i> }</span>
 ┊16┊13┊      <input
 ┊17┊14┊        type="checkbox"
 ┊18┊15┊        checked={ Boolean(task.isChecked) }
```

##### Changed imports&#x2F;ui&#x2F;TaskForm.jsx
```diff
@@ -1,17 +1,12 @@
-┊ 1┊  ┊import React, { useState } from 'react';
-┊ 2┊  ┊import Tasks from '/imports/api/tasks';
+┊  ┊ 1┊import React, {useState} from 'react';
 ┊ 3┊ 2┊
-┊ 4┊  ┊export const TaskForm = ({ user }) => {
+┊  ┊ 3┊export const TaskForm = () => {
 ┊ 5┊ 4┊  const [text, setText] = useState("");
 ┊ 6┊ 5┊
 ┊ 7┊ 6┊  const handleSubmit = () => {
 ┊ 8┊ 7┊    if (!text) return;
 ┊ 9┊ 8┊
-┊10┊  ┊    Tasks.insert({
-┊11┊  ┊      text: text.trim(),
-┊12┊  ┊      createdAt: new Date(),
-┊13┊  ┊      owner: user._id,
-┊14┊  ┊    });
+┊  ┊ 9┊    Meteor.call('tasks.insert', text.trim());
 ┊15┊10┊
 ┊16┊11┊    setText("");
 ┊17┊12┊  };
```

##### Changed server&#x2F;main.js
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
 ┊2┊2┊import Links from '/imports/api/links';
-┊3┊ ┊import Tasks from '/imports/api/tasks';
+┊ ┊3┊import { Tasks } from '/imports/api/tasks';
 ┊4┊4┊
 ┊5┊5┊function insertLink(title, url) {
 ┊6┊6┊  Links.insert({ title, url, createdAt: new Date() });
```

[}]: #

Now all of our inputs and buttons will start working again. What we gained?

1. When we insert tasks into the database, we can securely verify that the user is authenticated; the `createdAt` field is correct; and the `owner` and `username` fields are legitimate.
2. We can add extra validation logic to the methods later if we want.
3. Our client code is more isolated from our database logic. Instead of a lot of stuff happening in our event handlers, we have methods callable from anywhere.

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step6.md) | [Next Step >](step8.md) |
|:--------------------------------|--------------------------------:|

[}]: #
