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

{{{ diffStep 7.1 noTitle=true }}}

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

{{{ diffStep 7.2 noTitle=true }}}

## Step 7.3: Implement Method Calls

As we have defined our methods, we need to update the places we were operating the collection to use them instead.

{{{ diffStep 7.3 noTitle=true }}}

Now all of our inputs and buttons will start working again. What we gained?

1. When we insert tasks into the database, we can securely verify that the user is authenticated; the `createdAt` field is correct; and the `owner` and `username` fields are legitimate.
2. We can add extra validation logic to the methods later if we want.
3. Our client code is more isolated from our database logic. Instead of a lot of stuff happening in our event handlers, we have methods callable from anywhere.