'use strict'

const assert = require('assert')
const FileParser = require('./../lib/FileParser')

let fileParser

beforeEach(function () {
    fileParser = new FileParser()
})

describe('FileParser', function () {
    describe('#parse()', function () {
        it('should return an error if file path does not exist', function (done) {
            fileParser.parse('/wrong/path', function (err) {
                assert.equal(err.message, 'File /wrong/path does not exist.')
                done()
            })
        })
        
    })
})