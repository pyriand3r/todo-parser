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
            let response = parser.parse('')
            let expected = {
                original: '',
                residue: '',
                priority: null,
                creationDate: null,
                completionDate: null,
                description: '',
                context: [],
                project: [],
                done: false
            }
            assert.deepEqual(response, expected)
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
    })
})