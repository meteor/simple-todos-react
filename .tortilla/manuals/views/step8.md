# Step 8: Publish &amp; Subscribe

[//]: # (head-end)


Now we have moved all of our app's sensitive code into methods, we need to learn about the other half of Meteor's security story. Until now, we have worked assuming the entire database is present on the client, meaning if we call `Tasks.find()` we will get every task in the collection. That's not good if users of our application want to store privacy-sensitive data. We need a way of controlling which data Meteor sends to the client-side database.

## Step 8.1: More Security

Just like with `insecure` in the last step, all new Meteor apps start with the `autopublish` package, which automatically synchronizes all the database contents to the client. Let's remove it and see what happens:

```shell script
meteor remove autopublish
```

[{]: <helper> (diffStep 8.1 noTitle=true)

##### Changed .meteor&#x2F;packages
```diff
@@ -16,7 +16,6 @@
 ┊16┊16┊typescript@3.7.2              # Enable TypeScript syntax in .ts and .tsx modules
 ┊17┊17┊shell-server@0.4.0            # Server-side component of the `meteor shell` command
 ┊18┊18┊
-┊19┊  ┊autopublish@1.0.7             # Publish all data to the clients (for prototyping)
 ┊20┊19┊static-html             # Define static page content in .html files
 ┊21┊20┊react-meteor-data       # React higher-order component for reactively tracking Meteor data
 ┊22┊21┊accounts-password
```

##### Changed .meteor&#x2F;versions
```diff
@@ -1,7 +1,6 @@
 ┊1┊1┊accounts-base@1.5.0
 ┊2┊2┊accounts-password@1.5.3
 ┊3┊3┊allow-deny@1.1.0
-┊4┊ ┊autopublish@1.0.7
 ┊5┊4┊autoupdate@1.6.0
 ┊6┊5┊babel-compiler@7.5.1
 ┊7┊6┊babel-runtime@1.5.0
```

[}]: #

When the app refreshes, the task list will be empty. Without the `autopublish` package, we will have to specify explicitly what the server sends to the client. The functions in Meteor that do this are `Meteor.publish` and `Meteor.subscribe`.

## Step 8.2: Tasks Publication

For now let's add a publication for all tasks.

[{]: <helper> (diffStep 8.2 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.js
```diff
@@ -43,4 +43,8 @@
 ┊43┊43┊      }
 ┊44┊44┊    });
 ┊45┊45┊  }
-┊46┊  ┊});🚫↵
+┊  ┊46┊});
+┊  ┊47┊
+┊  ┊48┊if (Meteor.isServer) {
+┊  ┊49┊  Meteor.publish('tasks', function() { return Tasks.find() })
+┊  ┊50┊}
```

[}]: #

## Step 8.3: Tasks Subscription

Then we can quickly subscribe to tha publication.

[{]: <helper> (diffStep 8.3 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -21,11 +21,15 @@
 ┊21┊21┊    _.set(filter, 'checked', false);
 ┊22┊22┊  }
 ┊23┊23┊
-┊24┊  ┊  const { tasks, incompleteTasksCount, user } = useTracker(() => ({
-┊25┊  ┊    tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
-┊26┊  ┊    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count(),
-┊27┊  ┊    user: Meteor.user(),
-┊28┊  ┊  }));
+┊  ┊24┊  const { tasks, incompleteTasksCount, user } = useTracker(() => {
+┊  ┊25┊    Meteor.subscribe('tasks');
+┊  ┊26┊
+┊  ┊27┊    return ({
+┊  ┊28┊      tasks: Tasks.find(filter, {sort: {createdAt: -1}}).fetch(),
+┊  ┊29┊      incompleteTasksCount: Tasks.find({checked: {$ne: true}}).count(),
+┊  ┊30┊      user: Meteor.user(),
+┊  ┊31┊    });
+┊  ┊32┊  });
 ┊29┊33┊
 ┊30┊34┊  if (!user) {
 ┊31┊35┊    return (
```

[}]: #

Once you have done this, all the tasks will reappear.

Calling `Meteor.publish` on the server registers a publication named "tasks". When `Meteor.subscribe` is called on the client with the publication name, the client subscribes to all the data from that publication, which in this case is all the tasks in the database. To truly see the power of the `publish/subscribe` model, let's implement a feature that allows users to mark tasks as "private" so that no other users can see them.

## Step 8.4: Private Task Method

Let's add a new property to tasks called `isPrivate` and write a method for setting it.

[{]: <helper> (diffStep 8.4 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.js
```diff
@@ -42,6 +42,21 @@
 ┊42┊42┊        isChecked
 ┊43┊43┊      }
 ┊44┊44┊    });
+┊  ┊45┊  },
+┊  ┊46┊
+┊  ┊47┊  'tasks.setPrivate'(taskId, isPrivate) {
+┊  ┊48┊    check(taskId, String);
+┊  ┊49┊    check(isPrivate, Boolean);
+┊  ┊50┊
+┊  ┊51┊    if (!this.userId) {
+┊  ┊52┊      throw new Meteor.Error('Not authorized.');
+┊  ┊53┊    }
+┊  ┊54┊
+┊  ┊55┊    Tasks.update(taskId, {
+┊  ┊56┊      $set: {
+┊  ┊57┊        isPrivate
+┊  ┊58┊      }
+┊  ┊59┊    })
 ┊45┊60┊  }
 ┊46┊61┊});
```

[}]: #

## Step 8.5: Toggle Private

Now we just setup some wiring up to our `Task Component` and add a toggleable button.

[{]: <helper> (diffStep 8.5 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;App.jsx
```diff
@@ -10,6 +10,10 @@
 ┊10┊10┊  Meteor.call('tasks.setChecked', _id, !isChecked);
 ┊11┊11┊};
 ┊12┊12┊
+┊  ┊13┊const togglePrivate = ({ _id, isPrivate }) => {
+┊  ┊14┊  Meteor.call('tasks.setPrivate', _id, !isPrivate);
+┊  ┊15┊};
+┊  ┊16┊
 ┊13┊17┊const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
 ┊14┊18┊
 ┊15┊19┊const App = () => {
```
```diff
@@ -61,6 +65,7 @@
 ┊61┊65┊          task={ task }
 ┊62┊66┊          onCheckboxClick={toggleChecked}
 ┊63┊67┊          onDeleteClick={deleteTask}
+┊  ┊68┊          onTogglePrivateClick={togglePrivate}
 ┊64┊69┊        />) }
 ┊65┊70┊      </ul>
 ┊66┊71┊
```

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import React from 'react';
 ┊2┊2┊import classnames from 'classnames';
 ┊3┊3┊
-┊4┊ ┊export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
+┊ ┊4┊export const Task = ({ task, onCheckboxClick, onDeleteClick, onTogglePrivateClick }) => {
 ┊5┊5┊  const classes = classnames('task', {
 ┊6┊6┊    'checked': Boolean(task.isChecked)
 ┊7┊7┊  });
```
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊  return (
 ┊10┊10┊    <li className={classes}>
 ┊11┊11┊      <button onClick={ () => onDeleteClick(task) }>&times;</button>
+┊  ┊12┊      <button onClick={ () => onTogglePrivateClick(task) }>{ task.isPrivate ? 'Private' : 'Public' }</button>
 ┊12┊13┊      <span>{ task.text } { task.username && <i>({ task.username })</i> }</span>
 ┊13┊14┊      <input
 ┊14┊15┊        type="checkbox"
```

[}]: #

## Step 8.6: Add Private Class

We need a CSS class for future design work as well.

[{]: <helper> (diffStep 8.6 noTitle=true)

##### Changed imports&#x2F;ui&#x2F;Task.jsx
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊
 ┊4┊4┊export const Task = ({ task, onCheckboxClick, onDeleteClick, onTogglePrivateClick }) => {
 ┊5┊5┊  const classes = classnames('task', {
+┊ ┊6┊    'private': Boolean(task.isPrivate),
 ┊6┊7┊    'checked': Boolean(task.isChecked)
 ┊7┊8┊  });
```

[}]: #

## Step 8.7: Publish Visible Tasks

We should only publish tasks visible to the user, that is, if they are not private or if they are owned by the current user.

[{]: <helper> (diffStep 8.7 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.js
```diff
@@ -61,5 +61,12 @@
 ┊61┊61┊});
 ┊62┊62┊
 ┊63┊63┊if (Meteor.isServer) {
-┊64┊  ┊  Meteor.publish('tasks', function() { return Tasks.find() })
+┊  ┊64┊  Meteor.publish('tasks', function() {
+┊  ┊65┊    return Tasks.find({
+┊  ┊66┊      $or: [
+┊  ┊67┊        { private: { $ne: true } },
+┊  ┊68┊        { owner: this.userId }
+┊  ┊69┊      ]
+┊  ┊70┊    });
+┊  ┊71┊  })
 ┊65┊72┊}
```

[}]: #

## Step 8.8: Check User Permission

Only the owner of a task should be able to change certain things.

[{]: <helper> (diffStep 8.8 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.js
```diff
@@ -22,7 +22,9 @@
 ┊22┊22┊  'tasks.remove'(taskId) {
 ┊23┊23┊    check(taskId, String);
 ┊24┊24┊
-┊25┊  ┊    if (!this.userId) {
+┊  ┊25┊    const task = Tasks.findOne(taskId);
+┊  ┊26┊
+┊  ┊27┊    if (!this.userId || task.owner !== this.userId) {
 ┊26┊28┊      throw new Meteor.Error('Not authorized.');
 ┊27┊29┊    }
 ┊28┊30┊
```
```diff
@@ -33,7 +35,9 @@
 ┊33┊35┊    check(taskId, String);
 ┊34┊36┊    check(isChecked, Boolean);
 ┊35┊37┊
-┊36┊  ┊    if (!this.userId) {
+┊  ┊38┊    const task = Tasks.findOne(taskId);
+┊  ┊39┊
+┊  ┊40┊    if (task.isPrivate && task.owner !== this.userId) {
 ┊37┊41┊      throw new Meteor.Error('Not authorized.');
 ┊38┊42┊    }
 ┊39┊43┊
```
```diff
@@ -48,7 +52,9 @@
 ┊48┊52┊    check(taskId, String);
 ┊49┊53┊    check(isPrivate, Boolean);
 ┊50┊54┊
-┊51┊  ┊    if (!this.userId) {
+┊  ┊55┊    const task = Tasks.findOne(taskId);
+┊  ┊56┊
+┊  ┊57┊    if (!this.userId || task.owner !== this.userId) {
 ┊52┊58┊      throw new Meteor.Error('Not authorized.');
 ┊53┊59┊    }
```

[}]: #

## Step 8.9: Remove Unneeded Code

At this point of development we do not need this boilerplate anymore.

[{]: <helper> (diffStep 8.9 noTitle=true)

##### Changed server&#x2F;main.js
```diff
@@ -1,14 +1,6 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
-┊ 2┊  ┊import Links from '/imports/api/links';
-┊ 3┊  ┊import { Tasks } from '/imports/api/tasks';
-┊ 4┊  ┊
-┊ 5┊  ┊function insertLink(title, url) {
-┊ 6┊  ┊  Links.insert({ title, url, createdAt: new Date() });
-┊ 7┊  ┊}
-┊ 8┊  ┊
-┊ 9┊  ┊function insertTask(text) {
-┊10┊  ┊  Tasks.insert({ text, createdAt: new Date() });
-┊11┊  ┊}
+┊  ┊ 2┊import '/imports/api/links';
+┊  ┊ 3┊import '/imports/api/tasks';
 ┊12┊ 4┊
 ┊13┊ 5┊Meteor.startup(() => {
 ┊14┊ 6┊  if (!Accounts.findUserByUsername('meteorite')) {
```
```diff
@@ -17,39 +9,4 @@
 ┊17┊ 9┊      password: 'password'
 ┊18┊10┊    });
 ┊19┊11┊  }
-┊20┊  ┊
-┊21┊  ┊  if (Tasks.find().count() === 0) {
-┊22┊  ┊    [
-┊23┊  ┊      'First Task',
-┊24┊  ┊      'Second Task',
-┊25┊  ┊      'Third Task',
-┊26┊  ┊      'Fourth Task',
-┊27┊  ┊      'Fifth Task',
-┊28┊  ┊      'Sixth Task',
-┊29┊  ┊      'Seventh Task'
-┊30┊  ┊    ].forEach(insertTask)
-┊31┊  ┊  }
-┊32┊  ┊
-┊33┊  ┊  // If the Links collection is empty, add some data.
-┊34┊  ┊  if (Links.find().count() === 0) {
-┊35┊  ┊    insertLink(
-┊36┊  ┊      'Do the Tutorial',
-┊37┊  ┊      'https://www.meteor.com/tutorials/react/creating-an-app'
-┊38┊  ┊    );
-┊39┊  ┊
-┊40┊  ┊    insertLink(
-┊41┊  ┊      'Follow the Guide',
-┊42┊  ┊      'http://guide.meteor.com'
-┊43┊  ┊    );
-┊44┊  ┊
-┊45┊  ┊    insertLink(
-┊46┊  ┊      'Read the Docs',
-┊47┊  ┊      'https://docs.meteor.com'
-┊48┊  ┊    );
-┊49┊  ┊
-┊50┊  ┊    insertLink(
-┊51┊  ┊      'Discussions',
-┊52┊  ┊      'https://forums.meteor.com'
-┊53┊  ┊    );
-┊54┊  ┊  }
 ┊55┊12┊});
```

[}]: #

[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step7.md) | [Next Step >](step9.md) |
|:--------------------------------|--------------------------------:|

[}]: #
