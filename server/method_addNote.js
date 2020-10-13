import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'

Meteor.methods({
    addNote: function (noteBody) {

        console.log(noteBody)

        check(noteBody, String)

        if (noteBody.trim().length === 0) {
            throw new Meteor.Error('A note body is required!')
        }


        try {
            console.log('Inserting a new note')
            Notes.insert({
                noteBody,
                createdAt: new Date()
            })
        }
        catch (error) {
            console.log(error)
            throw new Meteor.Error(error)
        }

        return true
    }
})