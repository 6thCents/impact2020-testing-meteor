// @ts-nocheck
/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';

import Notes from '../../lib/notes'
import TestData from '../testData'

const sinonChai = require('sinon-chai')

const should = chai.should();

chai.use(sinonChai)

if (Meteor.isClient) {

    import withRenderedTemplate from './client-test-helpers';

    describe('Note List Tests', function () {

        let sandbox

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            Template.registerHelper('_', key => key)
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }))

            sandbox.stub(Notes, 'find')
            sandbox.stub(Meteor, 'call')

        })

        afterEach(function () {
            Template.deregisterHelper('_')
            sandbox.restore()
        })

        it('Should display the list correctly', function () {

            const n = TestData.fakeNotes({ count: 3 })

            Notes.find.returns(n)

            withRenderedTemplate('noteList', {}, function (el) {

                expect($(el).find('div.list-title'), 'title').to.have.length(1)
                expect($(el).find('div.list-title').text(), 'title').to.equal('Note Manager ')
                expect($(el).find('a#cmdAdd'), 'add button').to.have.length(1)
                expect($(el).find('input#search'), 'search input').to.have.length(1)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(0)
                expect($(el).find('div.note-item'), 'note items').to.have.length(3)

            });
        })

        it('Should prompt user for new note when add button is tapped', function () {

            const n = TestData.fakeNotes({ count: 3 })

            Notes.find.returns(n)

            withRenderedTemplate('noteList', {}, function (el) {

                expect($(el).find('div.list-title'), 'title').to.have.length(1)
                expect($(el).find('div.list-title').text(), 'title').to.equal('Note Manager ')
                expect($(el).find('a#cmdAdd'), 'add button').to.have.length(1)
                expect($(el).find('input#search'), 'search input').to.have.length(1)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(0)
                expect($(el).find('div.note-item'), 'note items').to.have.length(3)

                $(el).find('a#cmdAdd').click()

                Tracker.flush()

                expect($(el).find('div.note-item'), 'note items').to.have.length(0)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)
                expect($(el).find('button#cmdSave'), 'save button').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'cancel button').to.have.length(1)

            });
        })

        it('Should correctly add note when save is tapped', function () {

            Meteor.call.withArgs('addNote').yields(null, {})

            const n = TestData.fakeNotes({ count: 3 })

            Notes.find.returns(n)

            withRenderedTemplate('noteList', {}, function (el) {

                expect($(el).find('div.list-title'), 'title').to.have.length(1)
                expect($(el).find('div.list-title').text(), 'title').to.equal('Note Manager ')
                expect($(el).find('a#cmdAdd'), 'add button').to.have.length(1)
                expect($(el).find('input#search'), 'search input').to.have.length(1)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(0)
                expect($(el).find('div.note-item'), 'note items').to.have.length(3)

                $(el).find('a#cmdAdd').click()

                Tracker.flush()

                expect($(el).find('div.note-item'), 'note items').to.have.length(0)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)
                expect($(el).find('button#cmdSave'), 'save button').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'cancel button').to.have.length(1)

                $(el).find('textarea#noteBody').val('this is a fake note')

                $(el).find('button#cmdSave').click()

                Tracker.flush()

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(0)
                expect($(el).find('div.note-item'), 'note items').to.have.length(3)

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('addNote', 'this is a fake note')

            });
        })

        it('Should handle note add error correctly', function () {

            Meteor.call.withArgs('addNote').yields({ error: 'fake error' }, null)

            const n = TestData.fakeNotes({ count: 3 })

            Notes.find.returns(n)


            withRenderedTemplate('noteList', {}, function (el) {

                expect($(el).find('div.list-title'), 'title').to.have.length(1)
                expect($(el).find('div.list-title').text(), 'title').to.equal('Note Manager ')
                expect($(el).find('a#cmdAdd'), 'add button').to.have.length(1)
                expect($(el).find('input#search'), 'search input').to.have.length(1)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(0)
                expect($(el).find('div.note-item'), 'note items').to.have.length(3)

                $(el).find('a#cmdAdd').click()

                Tracker.flush()

                expect($(el).find('div.note-item'), 'note items').to.have.length(0)

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(1)
                expect($(el).find('textarea#noteBody'), 'note input').to.have.length(1)
                expect($(el).find('button#cmdSave'), 'save button').to.have.length(1)
                expect($(el).find('button#cmdCancel'), 'cancel button').to.have.length(1)

                $(el).find('textarea#noteBody').val('this is a fake note')

                $(el).find('button#cmdSave').click()

                Tracker.flush()

                expect($(el).find('form#note-add-form'), 'search input').to.have.length(1)
                expect($(el).find('div.note-item'), 'note items').to.have.length(0)

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('addNote', 'this is a fake note')

                expect($(el).find('div.error-message').text(), 'error message').to.equal('There was a problem adding your note - try again!')
            });
        })

    })
}