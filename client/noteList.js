import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import Notes from '../lib/notes'
import { Session } from 'meteor/session'

import { Constants } from '../lib/constants'


Template.noteList.onCreated(function () {
    const self = this

    self.addMode = new ReactiveVar(false)

    self.autorun(function () {
        Meteor.subscribe('allnotes');
    });

})

Template.noteList.helpers({

    note() {
        return Notes.find({}, { sort: { createdAt: -1 } })
    },

    showAdd() {
        return Template.instance().addMode.get()
    },

    allDone() {
        const instance = Template.instance()
        return function () {
            instance.addMode.set(false)
        }
    }
})

Template.noteList.events({
    'click a#cmdAdd': function (event, instance) {
        instance.addMode.set(true)
    }
})