/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { _ } from 'meteor/underscore'
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import Notes from '../../lib/notes'

chai.use(sinonChai)

if (Meteor.isServer) {

    describe('Notes Publication', () => {
        let sandbox
        let userId
        let noteIds = []

        beforeEach(function () {
            sandbox = sinon.createSandbox();
            sandbox.spy(Notes, 'find')
            userId = Random.id()
        });

        afterEach(function () {
            sandbox.restore()

            noteIds.forEach((n) => {
                Notes.remove({ _id: n })
            })

            // Notes.remove({})
        })

        // it('should verify input', async () => {

        //     // const collector = new PublicationCollector({ userId });
        //     const collector = new PublicationCollector();

        //     let collections;

        //     let msg = ''

        //     for (let i = 0; i < 3; i += 1) {
        //         const id = Notes.insert({ noteBody: `Note ${i}`, createdAt: new Date() })
        //         noteIds.push(id)
        //     }

        //     try {
        //         collections = await collector.collect('allnotes', null)
        //     }
        //     catch (err) {
        //         console.log(msg)
        //         msg = err.message;
        //     }

        //     expect(msg).to.equal('');

        //     expect(collections.notes).to.be.undefined

        //     expect(Notes.find).to.not.have.been.called
        // })

        it('should return all notes', async () => {

            const collector = new PublicationCollector();

            let collections;

            let msg = ''

            for (let i = 0; i < 3; i += 1) {
                const id = Notes.insert({ noteBody: `Note ${i}`, createdAt: new Date() })
                noteIds.push(id)
            }

            try {
                collections = await collector.collect('allnotes', ' ')
            }
            catch (err) {
                console.log(msg)
                msg = err.message;
            }

            expect(msg).to.equal('');

            expect(collections.notes.length).to.equal(3)
            expect(collections.notes[0].noteBody).to.equal('Note 0')
            expect(collections.notes[1].noteBody).to.equal('Note 1')
            expect(collections.notes[2].noteBody).to.equal('Note 2')

            expect(Notes.find).to.have.been.called
            let args = Notes.find.args[0]
            expect(args[0].noteBody.$regex).to.equal(' ')
            expect(args[0].noteBody.$options).to.equal('i')
        })

        it('should return filtered notes', async () => {

            const collector = new PublicationCollector();

            let collections;

            let msg = ''

            for (let i = 0; i < 3; i += 1) {
                const id = Notes.insert({ noteBody: `Note ${i}`, createdAt: new Date() })
                noteIds.push(id)
            }

            try {
                collections = await collector.collect('allnotes', '2')
            }
            catch (err) {
                console.log(msg)
                msg = err.message;
            }

            expect(msg).to.equal('');

            expect(collections.notes.length).to.equal(1)
            expect(collections.notes[0].noteBody).to.equal('Note 2')

            expect(Notes.find).to.have.been.called
            let args = Notes.find.args[0]
            expect(args[0].noteBody.$regex).to.equal('2')
            expect(args[0].noteBody.$options).to.equal('i')
        })

    })
}