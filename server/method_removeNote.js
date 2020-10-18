import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'

Meteor.methods({
    removeNote: function (id) {

        check(id, String)

        const note = Notes.findOne(id)

        if (!note) {
            throw new Meteor.Error('Note not found!')
        }

        Notes.remove({ _id: id })

        return true
    }
})