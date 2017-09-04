'use strict'

const assert = require('assert')
const proxyquire = require('proxyquire')

const readlineStub = {}
const fsStub = {}

const FileParser = proxyquire('./../lib/FileParser', {
    'readline': readlineStub,
    'fs': fsStub
})

let fileParser = new FileParser()

describe('FileParser', function () {
    describe('#parse()', function () {
        it('should return an error if file path does not exist', function (done) {
            fileParser.parse('/wrong/path', function (err) {
                assert.equal(err.message, 'File /wrong/path does not exist.')
                done()
            })
        })
        it('should return an array of todo tasks', function (done) {
            let streamMock = new require('stream').Readable()
            readlineStub.createInterface = function () { return streamMock }
            fsStub.existsSync = function () { return true }
            fsStub.createReadStream = function () { }

            fileParser.parse('/path/to/file', function (err, data) {
                if (err) {
                    done(err)
                }
                assert.equal(Array.isArray(data), true)
                done()
            })

            streamMock.emit('close')
        })
        it('should parse line events with the Parser', function (done) {
            let streamMock = new require('stream').Readable()
            readlineStub.createInterface = function () { return streamMock }
            fsStub.existsSync = function () { return true }
            fsStub.createReadStream = function () { }

            let expected = {
                original: '(A) Test task +context @project',
                residue: ' Test task  ',
                priority: 'A',
                creationDate: null,
                completionDate: null,
                description: 'Test task',
                context: ['context'],
                project: ['project'],
                done: false
            }

            fileParser.parse('/path/to/file', function (err, data) {
                if (err) {
                    done(err)
                }
                assert.equal(data.length, 1)
                assert.deepEqual(data[0], expected)
                done()
            })
            streamMock.emit('line', '(A) Test task +context @project')
            streamMock.emit('close')
        })
        it('should parse only not empty line events', function (done) {
            let streamMock = new require('stream').Readable()
            readlineStub.createInterface = function () { return streamMock }
            fsStub.existsSync = function () { return true }
            fsStub.createReadStream = function () { }

            fileParser.parse('/path/to/file', function (err, data) {
                if (err) {
                    done(err)
                }
                assert.equal(data.length, 0)
                done()
            })
            streamMock.emit('line', '')
            streamMock.emit('close')
        })
    })
    
    describe('#register()', function () {
        it('should pass input to its parsers register method', function (done) {
            let executed = false
            let streamMock = new require('stream').Readable()
            readlineStub.createInterface = function () { return streamMock }
            fsStub.existsSync = function () { return true }
            fsStub.createReadStream = function () { }

            fileParser.register(function () {
                executed = true
            })

            fileParser.parse('/path/to/file', function (err, data) {
                if (err) {
                    done(err)
                }
                assert.equal(executed, true)
                done()
            })
            streamMock.emit('line', '(A) test message')
            streamMock.emit('close')
        })
    })
})
