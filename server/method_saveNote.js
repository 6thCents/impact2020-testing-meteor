import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'

Meteor.methods({
    saveNote: function (id, noteValue) {

        check(id, String)
        check(noteValue, String)

        const note = Notes.findOne(id)

        if (!note) {
            throw new Meteor.Error('Note not found!')
        }

        Notes.update(
            {
                _id: id
            },
            {
                $set: {
                    noteBody: noteValue,
                    modifiedAt: new Date()
                }
            }
        )

        return true
    }
})