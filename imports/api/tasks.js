import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Tasks.insert({
      text,
      createdAt: new Date,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    })
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Tasks.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish('tasks', function() { return Tasks.find() })
}
