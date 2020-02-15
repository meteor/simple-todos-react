Now we have moved all of our app's sensitive code into methods, we need to learn about the other half of Meteor's security story. Until now, we have worked assuming the entire database is present on the client, meaning if we call `Tasks.find()` we will get every task in the collection. That's not good if users of our application want to store privacy-sensitive data. We need a way of controlling which data Meteor sends to the client-side database.

## Step 8.1: More Security

Just like with `insecure` in the last step, all new Meteor apps start with the `autopublish` package, which automatically synchronizes all the database contents to the client. Let's remove it and see what happens:

```shell script
meteor remove autopublish
```

{{{ diffStep 8.1 noTitle=true }}}

When the app refreshes, the task list will be empty. Without the `autopublish` package, we will have to specify explicitly what the server sends to the client. The functions in Meteor that do this are `Meteor.publish` and `Meteor.subscribe`.

## Step 8.2: Tasks Publication

For now let's add a publication for all tasks.

{{{ diffStep 8.2 noTitle=true }}}

## Step 8.3: Tasks Subscription

Then we can quickly subscribe to tha publication.

{{{ diffStep 8.3 noTitle=true }}}

Once you have done this, all the tasks will reappear.

Calling `Meteor.publish` on the server registers a publication named "tasks". When `Meteor.subscribe` is called on the client with the publication name, the client subscribes to all the data from that publication, which in this case is all the tasks in the database. To truly see the power of the `publish/subscribe` model, let's implement a feature that allows users to mark tasks as "private" so that no other users can see them.

## Step 8.4: Private Task Method

Let's add a new property to tasks called `isPrivate` and write a method for setting it.

{{{ diffStep 8.4 noTitle=true }}}

## Step 8.5: Toggle Private

Now we just setup some wiring up to our `Task Component` and add a toggleable button.

{{{ diffStep 8.5 noTitle=true }}}

## Step 8.6: Add Private Class

We need a CSS class for future design work as well.

{{{ diffStep 8.6 noTitle=true }}}

## Step 8.7: Publish Visible Tasks

We should only publish tasks visible to the user, that is, if they are not private or if they are owned by the current user.

{{{ diffStep 8.7 noTitle=true }}}

## Step 8.8: Check User Permission

Only the owner of a task should be able to change certain things.

{{{ diffStep 8.8 noTitle=true }}}

## Step 8.9: Remove Unneeded Code

At this point of development we do not need this boilerplate anymore.

{{{ diffStep 8.9 noTitle=true }}}