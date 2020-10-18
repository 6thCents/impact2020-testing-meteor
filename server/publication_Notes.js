import { Meteor } from 'meteor/meteor'
import Notes from '../lib/notes'

Meteor.publish('allnotes', function () {
    return Notes.find({})
});