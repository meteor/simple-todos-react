import { Meteor } from 'meteor/meteor';
import Tasks from '/imports/api/tasks';

Meteor.startup(() => {
  // Function to insert task
  function insertTask(text) {
    Tasks.insert({ text, createdAt: new Date() });
  }

  //Populate DB with some task
  if (Tasks.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task', 
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(insertTask)
  }
});
