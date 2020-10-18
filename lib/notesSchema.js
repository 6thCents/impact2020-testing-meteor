import SimpleSchema from 'simpl-schema'
import Notes from './notes'

NotesSchema = new SimpleSchema({
    _id: {
        type: String,
        label: 'ID',
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    noteBody: {
        type: String,
        label: 'The Note',
        max: 255
    },
    createdAt: {
        type: Date
    },
    modifiedAt: {
        type: Date,
        optional: true
    }
})

Notes.attachSchema(NotesSchema);
