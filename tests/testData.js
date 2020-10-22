import { Random } from 'meteor/random'
import moment from "moment"

export default class TestData {

    static fakeNotes(parms = {}) {

        const data = []

        const count = parms.count || 3

        for (let i = 0; i < 3; i += 1) {

            data.push({
                _id: Random.id(),
                noteBody: `Note ${i}`,
                createdAt: moment().toISOString()
            })

        }

        return data

    }

    static fakeNote(parms = {}) {

        const data = {}

        data._id = parms._id || Random.id(),
            data.noteBody = parms.noteBody || 'fake note body'
        data.createdAt = parms.createdAt || moment().toISOString()
        data.modifiedAt = parms.modifiedAt || null

        return data

    }

}