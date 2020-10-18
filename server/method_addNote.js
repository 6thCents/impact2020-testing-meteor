import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'
import logger from '../lib/logger'

Meteor.methods({
    addNote(noteBody) {

        // if (!this.userId){
        //     throw new Meteor.Error('You are not authorized to perform this action!')
        // }

        try {
            check(noteBody, String)
        }
        catch {
            throw new Meteor.Error('Note body must be a string!')
        }

        if (noteBody.trim().length === 0) {
            throw new Meteor.Error('A note body is required!')
        }

        try {
            return Notes.insert({
                noteBody,
                createdAt: new Date()
            })
        }
        catch (error) {
            logger.log(error)
            throw new Meteor.Error('An error occurred creating your note!')
        }

    }
})