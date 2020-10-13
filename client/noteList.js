import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import Notes from '../lib/notes'

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

    formattedDate(val) {
        const dt = new Date(val)
        return `${dt.toLocaleDateString()} ${dt.getHours()}:${dt.getMinutes()}`
    },

    allDone() {
        const instance = Template.instance()
        return function () {
            instance.addMode.set(false)
        }
    }
})

Template.noteList.events({
    'click button#cmdAdd': function (event, instance) {
        instance.addMode.set(true)
    }
})