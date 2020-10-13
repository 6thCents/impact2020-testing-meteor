import { Meteor } from 'meteor/meteor'
import Notes from '../lib/notes'

Meteor.publish('allnotes', function () {
    console.log('getting all notes')
    return Notes.find({})
});