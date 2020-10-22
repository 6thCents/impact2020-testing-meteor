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

        if (noteValue === note.noteBody) {
            return true // no point in doing anything nothing changed
        }

        try {
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
        }
        catch (error) {
            console.log(error)
            throw new Meteor.Error('Update failed try again later!')
        }

        return true
    }
})