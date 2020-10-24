/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai'
import Notes from '../../lib/notes'
import logger from '../../lib/logger'

chai.use(sinonChai)

describe('Method - Add Note', function () {

    let sandbox
    let subject
    let context

    beforeEach(function () {
        sandbox = sinon.createSandbox()
        sandbox.stub(logger, 'log')
        sandbox.stub(Notes, 'insert')

        //sandbox.spy(Notes, 'insert')

        context = {}

        subject = Meteor.server.method_handlers.addNote
    })

    afterEach(function () {
        sandbox.restore()
    })

    // it('should validate user is logged in', async () => {
    //     let msg = ''
    //     // context = { userId: Random.id() }

    //     try {
    //         await subject.apply(context, ['some note'])
    //     }
    //     catch (err) {
    //         msg = err.error
    //     }

    //     expect(Notes.insert).to.not.have.been.called
    //     expect(msg).to.equal('You are not authorized to perform this action!')
    // })

    it('should validate input', async () => {
        let msg = ''

        try {
            await subject.apply(context, [{ not: 'a string' }])
        }
        catch (err) {
            msg = err.error
        }

        expect(Notes.insert).to.not.have.been.called
        expect(msg).to.equal('Note body must be a string!')

    })

    it('should not allow blank notes', async () => {
        let msg = ''

        try {
            await subject.apply(context, [''])
        }
        catch (err) {
            msg = err.error
        }

        expect(Notes.insert).to.not.have.been.called
        expect(msg).to.equal('A note body is required!')
    })

    it('should handle insert error correctly', async () => {
        let msg = ''
        let result = null

        const fakeError = new Error('fake-error')

        Notes.insert.throws(fakeError)

        try {
            result = await subject.apply(context, ['fake note'])
        }
        catch (err) {
            msg = err.error
        }

        expect(Notes.insert).to.have.been.called
        const args = Notes.insert.args[0]

        expect(args[0].noteBody).to.equal('fake note')
        expect(_.isDate(args[0].createdAt)).to.be.true

        expect(logger.log).to.have.been.called
        expect(logger.log).to.have.been.calledWith(fakeError)

        expect(msg).to.equal('An error occurred creating your note!')
        expect(result).to.be.null
    })

    it('should handle insert correctly', async () => {
        let msg = ''

        Notes.insert.returns('fake-id')

        let result

        try {
            result = await subject.apply(context, ['fake note'])
        }
        catch (err) {
            msg = err.error
        }

        expect(msg).to.equal('')

        expect(Notes.insert).to.have.been.called
        const args = Notes.insert.args[0]

        // const expected = {}

        expect(args[0].noteBody).to.equal('fake note')
        // expect(args[0].noteBody).to.deep.equal(expected)
        expect(_.isDate(args[0].createdAt)).to.be.true

        expect(logger.log).to.not.have.been.called

        expect(result).to.equal('fake-id')
    })
})