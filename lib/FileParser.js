'use strict'

const fs = require('fs')
const readline = require('readline')
const Parser = require('./Parser')

/**
 * @class FileParser
 * Handles access to complete todo.txt files
 */
class FileParser {

    /**
     * @constructor
     */
    constructor() {
        this.parser = new Parser()
    }

    /**
     * @method
     * Parse a complete todo file into an array of js todo objects
     * asynchronious
     * 
     * @param {string} file A path to a todo file
     * @param {function} callback The callback to execute after parsing the todo file
     */
    parse(file, callback) {
        let me = this
        if (fs.existsSync(file) === false) {
            callback(new Error('File ' + file + ' does not exist.'))
            return
        }

        let data = []
        let stream = fs.createReadStream(file)
        let lineReader = readline.createInterface({
            input: stream
        })
        lineReader.on('line', function (line) {
            if (line !== '') {
                let todo = me.parser.parse(line)
                data.push(todo)
            }
        })

        lineReader.on('close', function () {
            callback(null, data)
        })
    }

    /**
     * @method
     * Register a custom parser method for the line parser
     * 
     * @param {function} parserMethod 
     */
    register(parserMethod) {
        this.parser.register(parserMethod)
    }
}

module.exports = FileParser