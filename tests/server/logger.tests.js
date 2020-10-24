/* eslint-env mocha */
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai'
import Logger from '../../lib/logger'

chai.use(sinonChai)

describe('Logger', function () {

    let sandbox

    beforeEach(function () {
        sandbox = sinon.createSandbox()

        // sandbox.stub(Logger, 'log')
        sandbox.spy(Logger, 'log')

        sandbox.stub(console, 'log')
    })

    afterEach(function () {
        sandbox.restore()
    })

    it('should call console log', () => {
        Logger.log('this is a test')

        expect(console.log, 'console log ran').to.have.been.called
        expect(console.log, 'console log printed correctly').to.have.been.calledWith('this is a test')
    })

})



