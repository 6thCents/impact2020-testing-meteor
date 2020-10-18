import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import moment from 'moment'

import { Constants } from '../lib/constants'

Template.noteItem.onCreated(function () {
    const self = this

    self.errorMessage = new ReactiveVar('')
    self.selectedId = new ReactiveVar(null)
    self.noteMode = new ReactiveVar(Constants.NoteModes.NONE)

})

Template.noteItem.helpers({
    errorMessage() {
        return Template.instance().errorMessage.get()
    },

    dateValue() {
        if (this.modifiedAt) {
            return `Last Modified ${moment(this.modifiedAt).format('YYYY-MM-DD HH:MM A')}`
        }
        return `Created at ${moment(this.createdAt).format('YYYY-MM-DD HH:MM A')}`
    },
    noneMode() {
        const instance = Template.instance()

        const noteMode = instance.noteMode.get()
        const id = instance.selectedId.get()

        if (id !== this._id) {
            return true
        }

        if (noteMode) {
            return noteMode === Constants.NoteModes.NONE
        }
        return true
    },
    editMode() {
        const instance = Template.instance()

        const noteMode = instance.noteMode.get()
        const id = instance.selectedId.get()

        return (noteMode === Constants.NoteModes.EDIT && id === this._id)
    },
    deleteMode() {
        const instance = Template.instance()

        const noteMode = instance.noteMode.get()
        const id = instance.selectedId.get()

        return (noteMode === Constants.NoteModes.DELETE && id === this._id)
    }
})

Template.noteItem.events({
    'click button#btnDelete': function (event, instance) {
        event.preventDefault()
        instance.selectedId.set(this._id)
        instance.noteMode.set(Constants.NoteModes.DELETE)
    },
    'click button#btnDeleteYes': function (event, instance) {
        event.preventDefault()
        const id = instance.selectedId.get()
        instance.errorMessage.set('')
        Meteor.call('removeNote', id, function (err, response) {
            if (err) {
                instance.errorMessage.set(err.error)
            }
            else {
                instance.selectedId.set(null)
                instance.noteMode.set(Constants.NoteModes.NONE)
            }
        })
    },
    'click button#btnDeleteNo': function (event, instance) {
        event.preventDefault()
        instance.selectedId.set(null)
        instance.noteMode.set(Constants.NoteModes.NONE)
    },
    'click button#btnEdit': function (event, instance) {
        event.preventDefault()
        instance.selectedId.set(this._id)
        instance.noteMode.set(Constants.NoteModes.EDIT)
    },
    'click button#btnEditSave': function (event, instance) {
        event.preventDefault()
        const id = instance.selectedId.get()
        const note = $('textarea#noteBody').val()
        instance.errorMessage.set('')
        Meteor.call('saveNote', id, note, function (err, response) {
            if (err) {
                instance.errorMessage.set(err.error)
            }
            else {
                instance.selectedId.set(null)
                instance.noteMode.set(Constants.NoteModes.NONE)
            }
        })
    },
    'click button#btnEditCancel': function (event, instance) {
        event.preventDefault()
        instance.selectedId.set(null)
        instance.noteMode.set(Constants.NoteModes.NONE)
    }
})