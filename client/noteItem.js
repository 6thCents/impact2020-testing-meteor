import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import moment from 'moment'

import { Constants } from '../lib/constants'


Template.noteItem.helpers({
    formattedDate(val) {
        return moment(val).format('YYYY-MM-DD HH:MM A')
    },
    dateValue() {
        if (this.modifiedAt) {
            return `Last Modified ${moment(this.modifiedAt).format('YYYY-MM-DD HH:MM A')}`
        }
        return `Created at ${moment(this.createdAt).format('YYYY-MM-DD HH:MM A')}`
    },
    noneMode() {
        const noteMode = Session.get(Constants.NOTEMODE)
        const id = Session.get(Constants.SelectedId)
        if (id !== this._id) {
            return true
        }
        if (noteMode) {
            return Session.get(Constants.NOTEMODE) === Constants.NoteModes.NONE
        }
        return true
    },
    editMode() {
        return Session.get(Constants.NOTEMODE) == Constants.NoteModes.EDIT && Session.get(Constants.SelectedId) === this._id
    },
    deleteMode() {
        return Session.get(Constants.NOTEMODE) == Constants.NoteModes.DELETE && Session.get(Constants.SelectedId) === this._id
    }
})

Template.noteItem.events({
    'click a#btnDelete': function (event, instance) {
        event.preventDefault()
        Session.set(Constants.SelectedId, this._id)
        Session.set(Constants.NOTEMODE, Constants.NoteModes.DELETE)
    },
    'click button#btnDeleteYes': function (event, instance) {
        event.preventDefault()
        const id = Session.get(Constants.SelectedId)
        Meteor.call('removeNote', id, function (err, response) {
            Session.set(Constants.SelectedId, null)
            Session.set(Constants.NOTEMODE, Constants.NoteModes.NONE)
        })
    },
    'click button#btnDeleteNo': function (event, instance) {
        event.preventDefault()
        Session.set(Constants.SelectedId, null)
        Session.set(Constants.NOTEMODE, Constants.NoteModes.NONE)
    },
    'click a#btnEdit': function (event, instance) {
        event.preventDefault()
        Session.set(Constants.SelectedId, this._id)
        Session.set(Constants.NOTEMODE, Constants.NoteModes.EDIT)
    },
    'click button#btnEditSave': function (event, instance) {
        event.preventDefault()
        const id = Session.get(Constants.SelectedId)
        const note = $('textarea#noteBody').val()
        Meteor.call('saveNote', id, note, function (err, response) {
            Session.set(Constants.SelectedId, null)
            Session.set(Constants.NOTEMODE, Constants.NoteModes.NONE)
        })
        Session.set(Constants.SelectedId, null)
        Session.set(Constants.NOTEMODE, Constants.NoteModes.NONE)
    },
    'click button#btnEditCancel': function (event, instance) {
        event.preventDefault()
        Session.set(Constants.SelectedId, null)
        Session.set(Constants.NOTEMODE, Constants.NoteModes.NONE)
    }
})