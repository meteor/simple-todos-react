# Step 10: Testing

[//]: # (head-end)


Now we've created a few features for our application, let's add a test to ensure that we don't regress and that it works the way we expect.

We'll write a test which executes one of our Methods and verifies that it works correctly.

## Step 10.1: Install Dependencies

We'll add a test driver for the Mocha JavaScript test framework, along with a test assertion library:

```shell script
meteor add meteortesting:mocha
meteor npm install --save-dev chai
```

[{]: <helper> (diffStep 10.1 files=".meteor/packages,.meteor/versions,package.json" noTitle=true)

##### Changed .meteor&#x2F;packages
```diff
@@ -19,3 +19,4 @@
 ┊19┊19┊static-html             # Define static page content in .html files
 ┊20┊20┊react-meteor-data       # React higher-order component for reactively tracking Meteor data
 ┊21┊21┊accounts-password
+┊  ┊22┊meteortesting:mocha
```

##### Changed .meteor&#x2F;versions
```diff
@@ -32,14 +32,20 @@
 ┊32┊32┊hot-code-push@1.0.4
 ┊33┊33┊html-tools@1.0.11
 ┊34┊34┊htmljs@1.0.11
+┊  ┊35┊http@1.4.2
 ┊35┊36┊id-map@1.1.0
 ┊36┊37┊inter-process-messaging@0.1.0
 ┊37┊38┊launch-screen@1.1.1
 ┊38┊39┊livedata@1.0.18
+┊  ┊40┊lmieulet:meteor-coverage@1.1.4
 ┊39┊41┊localstorage@1.2.0
 ┊40┊42┊logging@1.1.20
 ┊41┊43┊meteor@1.9.3
 ┊42┊44┊meteor-base@1.4.0
+┊  ┊45┊meteorhacks:picker@1.0.3
+┊  ┊46┊meteortesting:browser-tests@1.0.0
+┊  ┊47┊meteortesting:mocha@1.1.4
+┊  ┊48┊meteortesting:mocha-core@7.0.1
 ┊43┊49┊minifier-css@1.5.0
 ┊44┊50┊minifier-js@2.6.0
 ┊45┊51┊minimongo@1.4.5
```
```diff
@@ -76,5 +82,6 @@
 ┊76┊82┊tracker@1.2.0
 ┊77┊83┊typescript@3.7.4
 ┊78┊84┊underscore@1.0.10
+┊  ┊85┊url@1.2.0
 ┊79┊86┊webapp@1.8.2
 ┊80┊87┊webapp-hashing@1.0.9
```

##### Changed package.json
```diff
@@ -22,5 +22,8 @@
 ┊22┊22┊      "server": "server/main.js"
 ┊23┊23┊    },
 ┊24┊24┊    "testModule": "tests/main.js"
+┊  ┊25┊  },
+┊  ┊26┊  "devDependencies": {
+┊  ┊27┊    "chai": "^4.2.0"
 ┊25┊28┊  }
 ┊26┊29┊}
```

[}]: #

We can now run our app in "test mode" by running meteor test and specifying a test driver package (you'll need to stop the regular app from running, or specify an alternate port with --port XYZ):

```shell script
TEST_WATCH=1 meteor test --driver-package meteortesting:mocha
```

It should output something like this:

```text
simple-todos-react
  ✓ package.json has correct name
  ✓ server is not client

2 passing (10ms)
```

Where are these two tests coming from? Every new Meteor application includes a `tests/main.js` module containing several example tests using the `describe`, `it`, and `assert` style popularized by testing frameworks like Mocha.

## Step 10.2: Scaffold Test

However, if you would prefer to split your tests across multiple modules, you can do that too. Let's add a new test module called `imports/api/tasks.tests.js`:

[{]: <helper> (diffStep 10.2 noTitle=true)

##### Added imports&#x2F;api&#x2F;tasks.tests.js
```diff
@@ -0,0 +1,10 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊
+┊  ┊ 3┊if (Meteor.isServer) {
+┊  ┊ 4┊  describe('Tasks', () => {
+┊  ┊ 5┊    describe('methods', () => {
+┊  ┊ 6┊      it('can delete owned task', () => {
+┊  ┊ 7┊      });
+┊  ┊ 8┊    });
+┊  ┊ 9┊  });
+┊  ┊10┊}🚫↵
```

[}]: #

## Step 10.3: Prepare Database

In any test we need to ensure the database is in the state we expect before beginning. We can use Mocha's `beforeEach` construct to do that easily:

[{]: <helper> (diffStep 10.3 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.tests.js
```diff
@@ -1,8 +1,25 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Random } from 'meteor/random';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Tasks } from './tasks.js';
 ┊ 2┊ 5┊
 ┊ 3┊ 6┊if (Meteor.isServer) {
 ┊ 4┊ 7┊  describe('Tasks', () => {
 ┊ 5┊ 8┊    describe('methods', () => {
+┊  ┊ 9┊      const userId = Random.id();
+┊  ┊10┊      let taskId;
+┊  ┊11┊
+┊  ┊12┊      beforeEach(() => {
+┊  ┊13┊        Tasks.remove({});
+┊  ┊14┊
+┊  ┊15┊        taskId = Tasks.insert({
+┊  ┊16┊          text: 'Test Task',
+┊  ┊17┊          createdAt: new Date(),
+┊  ┊18┊          owner: userId,
+┊  ┊19┊          username: 'meteorite',
+┊  ┊20┊        });
+┊  ┊21┊      });
+┊  ┊22┊
 ┊ 6┊23┊      it('can delete owned task', () => {
 ┊ 7┊24┊      });
 ┊ 8┊25┊    });
```

[}]: #

Here we create a single task that's associated with a random userId that'll be different for each test run.

## Step 10.4: Test Task Removal

Now we can write the test to call the `tasks.remove` method "as" that user and verify the task got deleted:

[{]: <helper> (diffStep 10.4 noTitle=true)

##### Changed imports&#x2F;api&#x2F;tasks.tests.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
 ┊2┊2┊import { Random } from 'meteor/random';
+┊ ┊3┊import { assert } from 'chai';
 ┊3┊4┊
 ┊4┊5┊import { Tasks } from './tasks.js';
 ┊5┊6┊
```
```diff
@@ -21,6 +22,17 @@
 ┊21┊22┊      });
 ┊22┊23┊
 ┊23┊24┊      it('can delete owned task', () => {
+┊  ┊25┊        // Isolate internal method implementation.
+┊  ┊26┊        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
+┊  ┊27┊
+┊  ┊28┊        // Set up a fake method call context.
+┊  ┊29┊        const invocation = { userId };
+┊  ┊30┊
+┊  ┊31┊        // Run the method with `this` set to the mock context.
+┊  ┊32┊        deleteTask.apply(invocation, [taskId]);
+┊  ┊33┊
+┊  ┊34┊        // Check its behavior.
+┊  ┊35┊        assert.equal(Tasks.find().count(), 0);
 ┊24┊36┊      });
 ┊25┊37┊    });
 ┊26┊38┊  });
```

[}]: #

## Step 10.5: Import Test

The only remaining step is to import this new test module into the main `tests/main.js` module:

[{]: <helper> (diffStep 10.5 noTitle=true)

##### Changed tests&#x2F;main.js
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import assert from "assert";
 ┊2┊2┊
+┊ ┊3┊import "../imports/api/tasks.tests.js";
+┊ ┊4┊
 ┊3┊5┊describe("simple-todos-react", function () {
 ┊4┊6┊  it("package.json has correct name", async function () {
 ┊5┊7┊    const { name } = await import("../package.json");
```

[}]: #

If you run the test command again or left it running in watch mode before, you should see the following output:

```text
Tasks
  methods
    ✓ can delete owned task

simple-todos-react
  ✓ package.json has correct name
  ✓ server is not client

3 passing (120ms)
```

To make it easier to type the test command, you may want to add a shorthand to the "scripts" section of your `package.json` file.

In fact, new Meteor apps come with a few preconfigured npm scripts, which you are welcome to use or modify.

The standard `npm test` command runs the following command:

```shell script
meteor test --once --driver-package meteortesting:mocha
```

This command is suitable for running in a Continuous Integration (CI) environment such as [Travis CI](https://travis-ci.org/) or [CircleCI](https://circleci.com/), since it runs only your server-side tests and then exits with 0 if all the tests passed.

If you would like to run your tests while developing your application (and re-run them whenever the development server restarts), consider using meteor npm run test-app, which is equivalent to:

```shell script
TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha
```

This is almost the same as the earlier command, except that it also loads your application code as normal (due to `--full-app`), allowing you to interact with your app in the browser while running both client and server tests.

> There's a lot more you can do with Meteor tests! You can read more about it in the Meteor Guide [article on testing](https://guide.meteor.com/testing.html).


[//]: # (foot-start)

[{]: <helper> (navStep)

| [< Previous Step](step9.md) | [Next Step >](step11.md) |
|:--------------------------------|--------------------------------:|

[}]: #
