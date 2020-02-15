Now we've created a few features for our application, let's add a test to ensure that we don't regress and that it works the way we expect.

We'll write a test which executes one of our Methods and verifies that it works correctly.

## Step 10.1: Install Dependencies

We'll add a test driver for the Mocha JavaScript test framework, along with a test assertion library:

```shell script
meteor add meteortesting:mocha
meteor npm install --save-dev chai
```

{{{ diffStep 10.1 noTitle=true files=".meteor/packages,.meteor/versions,package.json" }}}

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

{{{ diffStep 10.2 noTitle=true }}}

## Step 10.3: Prepare Database

In any test we need to ensure the database is in the state we expect before beginning. We can use Mocha's `beforeEach` construct to do that easily:

{{{ diffStep 10.3 noTitle=true }}}

Here we create a single task that's associated with a random userId that'll be different for each test run.

## Step 10.4: Test Task Removal

Now we can write the test to call the `tasks.remove` method "as" that user and verify the task got deleted:

{{{ diffStep 10.4 noTitle=true }}}

## Step 10.5: Import Test

The only remaining step is to import this new test module into the main `tests/main.js` module:

{{{ diffStep 10.5 noTitle=true }}}

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
