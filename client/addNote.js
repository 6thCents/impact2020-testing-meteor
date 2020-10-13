Template.addNote.onCreated(function () {
    this.errorMsg = new ReactiveVar('')
})

Template.addNote.helpers({
    errorMessage() {
        return Template.instance().errorMsg.get()
    }
})

Template.addNote.events({
    'submit form#note-add-form': function (event, instance) {
        event.preventDefault()
        const self = this
        const noteBody = event.target.noteBody.value
        instance.errorMsg.set('')
        Meteor.call('addNote', noteBody, function (err, response) {
            if (err) {
                instance.errorMsg.set('There was a problem adding your note - try again!')
            }
            else {
                self.done() // callback passed in
            }
        })
    },
    'click button#cmdCancel': function (event, instance) {
        event.preventDefault()
        this.done()
    }
})