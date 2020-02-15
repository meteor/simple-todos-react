import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

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
      });
    });
  });
}