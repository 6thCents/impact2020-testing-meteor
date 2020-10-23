/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';

const sinonChai = require('sinon-chai')

const should = chai.should();

chai.use(sinonChai)

if (Meteor.isClient) {

    import withRenderedTemplate from './client-test-helpers';
    import '../../client/addNote.html'

    describe.only('Add Note Blaze Component Tests', function () {

        let sandbox
        let doneStub

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            Template.registerHelper('_', key => key)
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }))

            doneStub = sandbox.stub()
            sandbox.stub(Meteor, 'call')

        })

        afterEach(function () {
            Template.deregisterHelper('_')
            sandbox.restore()
        })

        it('Should display component correctly', function () {

            withRenderedTemplate('addNote', { done: doneStub }, function (el) {

                expect($(el).find('form#note-add-form'), 'form').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)

                expect($(el).find('button#cmdSave'), 'search input').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'search input').to.have.length(1)

                expect($(el).find('div.error-message'), 'error').to.have.length(1)
                expect($(el).find('div.error-message').text(), 'error message').to.equal('')

            });
        })

        it('Should add note correctly', function () {

            Meteor.call.yields(null, {})

            withRenderedTemplate('addNote', { done: doneStub }, function (el) {

                expect($(el).find('form#note-add-form'), 'form').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)

                expect($(el).find('button#cmdSave'), 'search input').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'search input').to.have.length(1)

                expect($(el).find('div.error-message'), 'error').to.have.length(1)
                expect($(el).find('div.error-message').text(), 'error message').to.equal('')

                $(el).find('textarea#noteBody').val('this is a fake note')

                $(el).find('button#cmdSave').click()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('addNote', 'this is a fake note')

                expect(doneStub).to.have.been.called

            });
        })

        it('Should handle add note error correctly', function () {

            Meteor.call.yields({ any: 'thing' }, {})

            withRenderedTemplate('addNote', { done: doneStub }, function (el) {

                expect($(el).find('form#note-add-form'), 'form').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)

                expect($(el).find('button#cmdSave'), 'search input').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'search input').to.have.length(1)

                expect($(el).find('div.error-message'), 'error').to.have.length(1)
                expect($(el).find('div.error-message').text(), 'error message').to.equal('')

                $(el).find('textarea#noteBody').val('this is a fake note')

                $(el).find('button#cmdSave').click()

                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('addNote', 'this is a fake note')

                expect(doneStub).to.not.have.been.called
                expect($(el).find('div.error-message').text(), 'error message').to.equal('There was a problem adding your note - try again!')

            });
        })
    })
}