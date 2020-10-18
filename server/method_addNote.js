import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'

Meteor.methods({
    addNote: function (noteBody) {

        check(noteBody, String)

        if (noteBody.trim().length === 0) {
            throw new Meteor.Error('A note body is required!')
        }

        Notes.insert({
            noteBody,
            createdAt: new Date()
        })

        return true
    }
})