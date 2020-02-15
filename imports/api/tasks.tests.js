import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});

        taskId = Tasks.insert({
          text: 'Test Task',
          createdAt: new Date(),
          owner: userId,
          username: 'meteorite',
        });
      });

      it('can delete owned task', () => {
        // Isolate internal method implementation.
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method call context.
        const invocation = { userId };

        // Run the method with `this` set to the mock context.
        deleteTask.apply(invocation, [taskId]);

        // Check its behavior.
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}