import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


if(Meteor.isServer){
    console.log("I am the server");
}