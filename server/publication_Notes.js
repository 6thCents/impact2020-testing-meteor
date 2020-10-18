import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Notes from '../lib/notes'

Notes._ensureIndex({ noteBody: 1 });

Meteor.publish('allnotes', function (search) {

    // try {
    //     check(search, String)
    // }
    // catch {
    //     return this.ready()
    // }

    return Notes.find({ noteBody: { $regex: search, $options: 'i' } })
}); 