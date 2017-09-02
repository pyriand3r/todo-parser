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
     * @method
     * Parse a complete todo file into an array of js todo objects
     * asynchronious
     * 
     * @param {string} file A path to a todo file
     * @param {fun}
     * @return {[]} An array of todo objects
     */
    parse(file, callback) {

        if (fs.existsSync(file) === false) {
            callback(new Error('File ' + file + ' does not exist.'))
            return
        }

        let data = []
        let parser = new Parser()
        let stream = fs.createReadStream(file)
        let lineReader = readline.createInterface({
            input: stream
        })
        lineReader.on('line', function (line) {
            if (line !== '') {
                let todo = parser.parse(line)
                data.push(todo)
            }
        })

        lineReader.on('close', function () {
            callback(null, data)
        })
    }
}

module.exports = FileParser