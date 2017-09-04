'use strict'

const assert = require('assert');
const Parser = require('../lib/Parser')

let parser

beforeEach(function() {
    parser = new Parser
})

describe('Parser', function() {
    describe('#parse()', function() {
        it('should return an object', function () {
            let response = parser.parse('x test message')

            assert.equal(typeof response, 'object')
        })
        it('should throw an error if input is not a string', function () {
            assert.throws(function () {
                parser.parse(1)
            })
        })
        it('should parse out the priority if present', function () {
            let response = parser.parse('(A) Test todo message')
            assert.equal(response.priority, 'A')
        })
        it('should parse out the context if present', function () {
            let response = parser.parse('Test message +context')
            assert.equal(response.context.length, 1)
            assert.equal(response.context[0], 'context')
        })
        it('should parse out the project if present', function () {
            let response = parser.parse('Test message @project')
            assert.equal(response.project.length, 1)
            assert.equal(response.project[0], 'project')
        })
        it('should parse out the creation date if present', function () {
            let response = parser.parse('2017-01-01 Test message')
            let actual = response.creationDate.getDate()
            let expected = new Date('2017-01-01')
            assert.equal(actual, expected.getDate())
        })
        it('should parse out the creation date if present after priority', function () {
            let response = parser.parse('(A) 2017-01-01 Test message')
            let actual = response.creationDate.getDate()
            let expected = new Date('2017-01-01')
            assert.equal(actual, expected.getDate())
        })
        it('should parse out the creation date if present after done tag with completion date', function() {
            let response = parser.parse('x 2017-01-05 2017-01-01 Test message')
            let actual = response.creationDate.getDate()
            let expected = new Date('2017-01-01')
            assert.equal(actual, expected.getDate())
        })
        it('should parse out the todo text without starting and trailing whitespaces', function () {
            let response = parser.parse('x 2017-01-01 Test message +context @project')
            assert.equal(response.description, 'Test message')
        })
        it('should parse out the completion date of done task', function() {
            let response = parser.parse('x 2017-01-05 2017-01-01 Test message')
            let actual = response.completionDate.getDate()
            let expected = new Date('2017-01-05')
            assert.equal(actual, expected.getDate())
        })
        it('should execute every customParser method registered', function () {
            let executed = false
            parser.register(function () {
                executed = true
            })
            parser.parse('(A) test message')
            assert.equal(executed, true)
        })
        it('should pass the data object to the customMethods', function () {
            let expected = {
                original: '(A) test message',
                residue: ' test message',
                priority: 'A',
                creationDate: null,
                completionDate: null,
                description: 'test message',
                context: [],
                project: [],
                done: false
            }
            parser.register(function (data) {
                assert.deepEqual(data, expected)
            })
            parser.parse('(A) test message')
        })
    })

    describe('#register()', function () {
        it('should add a method to the customParser array', function () {
            parser.register(function () {})
            assert.equal(parser.customParser.length, 1)
        })
        it('should not add anything else than a method to the customParser array', function () {
            parser.register('string')
            parser.register(1)
            parser.register(true)
            parser.register(['array'])
            parser.register({type: 'object'})
            assert.equal(parser.customParser.length, 0)
        })
    })
})