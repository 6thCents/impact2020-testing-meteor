import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import Notes from '../lib/notes'
import { _ } from 'meteor/underscore'

Template.noteList.onCreated(function () {
    const self = this

    self.addMode = new ReactiveVar(false)
    self.search = new ReactiveVar('')
    self.searchWorking = new ReactiveVar(false)

    self.autorun(function () {

        const search = self.search.get()

        Meteor.subscribe('allnotes', search);
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
    },
    searchWorking() {
        return Template.instance().searchWorking.get()
    }
})

Template.noteList.events({
    'click a#cmdAdd': function (event, instance) {
        instance.addMode.set(true)
        setTimeout(() => {
            $('textarea#noteBody').focus()
        }, 100)
    },
    'keyup input#search': _.debounce(function (event, instance) {
        instance.searchWorking.set(true)
        setTimeout(() => {
            const search = event.target.value
            instance.search.set(search)
            instance.searchWorking.set(false)
        }, 500)
    }, 350),
})