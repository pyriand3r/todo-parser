'use strict'


/**
 * @class Parser
 * Transform todo.txt todos
 * 
 */
class Parser {

    /**
     * @constructor
     */
    constructor () {
        this.customParser = []
        this.parser = {
            done: this._parseDone,
            priority: this._parsePriority,
            creationDate: this._parseCreationDate,
            completionDate: this._parseCompletionDate,
            context: this._parseContext,
            project: this._parseProject,
            description: this._parseDescription
        }
    }

    /**
     * Return the object representation of a todo.txt line
     * @param {string} line A line of a todo.txt file aka a todo.txt task
     */
    parse(line) {
        if (typeof line !== 'string') {
            throw new Error('Input is not a string')
        }
        let data = {
            original: line,
            residue: line,
            priority: null,
            creationDate: null,
            completionDate: null,
            description: '',
            context: [],
            project: [],
            done: false
        }
        this.parser.done(data)

        if (data.done === false) {
            this.parser.priority(data)            
        } else {
            this.parser.completionDate(data)
        }

        this.parser.context(data)
        this.parser.project(data)
        this.parser.creationDate(data)

        for (let i = 0; i < this.customParser.length; i++) {
            this.customParser[i](data)
        }

        this.parser.description(data)       
        delete data.residue

        return data
    }

    /**
     * @method
     * Register a custom parser method
     * 
     * @param {method} customMethod A custom parser method
     */
    register(customMethod) {
        if (typeof customMethod !== 'function') {
            throw new Error('custom method is not a function.')
        }
        this.customParser.push(customMethod)
    }

    /**
     * @method
     * Override the standard parser with new methods
     * 
     * @param {string} parser The name of the parser to override 
     * @param {function} method  The override function
     */
    override(parser, method) {
        if (!this.parser.hasOwnProperty(parser)) {
            throw new Error('Parser with name >' + parser + '< does not exist.')
        }
        if (typeof method !== 'function') {
            throw new Error('Parser method is not a function.')
        }
        this.parser[parser] = method
    }

    /**
     * @method
     * Parse out the done tag
     * @param {{}} data 
     * @private
     */
    _parseDone(data) {
        if (data.original.indexOf('x ') === 0) {
            data.done = true
            data.residue = data.residue.replace('x ', '')
        }
    }

    /**
     * @method
     * Parse out the priority
     * 
     * @param {{}} data 
     * @private
     */
    _parsePriority(data) {
        let match = data.original.match(/^\(([A-Z])\)/)
        if (match !== null) {
            data.priority = match[1];
            data.residue = data.residue.replace('(' + match[1] + ')', '')
        }
    }

    /**
     * @method
     * Parse out the context
     * 
     * @param {{}} data 
     * @private
     */
    _parseContext(data) {
        let match = data.original.match(/\+([A-Za-z0-9]*)/g)
        if (match !== null) {
            for (let i = 0; i < match.length; i++)  {
                data.context.push(match[i].substring(1))
                data.residue = data.residue.replace(match[i], '')
            }
        }
    }

    /**
     * @method
     * Parse out the project
     * 
     * @param {{}} data 
     * @private
     */
    _parseProject(data) {
        let match = data.original.match(/@([A-Za-z0-9]*)/g)
        if (match !== null) {
            for (let i = 0; i < match.length; i++)  {
                data.project.push(match[i].substring(1))
                data.residue = data.residue.replace(match[i], '')
            }
        }
    }

    /**
     * @method
     * Parse out the creation date
     * @param {{}} data 
     * @private
     */
    _parseCreationDate(data) {
        let regex = /(^|^\([A-Z]\)\s)([0-9]{4}-[0-9]{2}-[0-9]{2})/
        if (data.done === true) {
            regex = /(^x\s[0-9]{4}-[0-9]{2}-[0-9]{2}\s)([0-9]{4}-[0-9]{2}-[0-9]{2})/
        }
        let match = data.original.match(regex)
        if (match !== null) {
            data.creationDate = new Date(match[2])
            data.residue = data.residue.replace(match[2], '')
        }
    }

    /**
     * @method
     * Clean up the residue after removing all other parts. This will be the 
     * todo description
     * 
     * @param {{}} data
     * @private 
     */
    _parseDescription(data) {
        data.description = data.residue.replace(/^\s+|\s+$/g,'')
    }

    /**
     * @method
     * Parse out the completion date of completed tasks
     * 
     * @param {{}} data 
     * @private
     */
    _parseCompletionDate(data) {
        let match = data.original.match(/^x\s([0-9]{4}-[0-9]{2}-[0-9]{2})/)
        if (match !== null) {
            data.completionDate = new Date(match[1])
            data.residue = data.residue.replace(match[1], '')
        }
    }
}

module.exports = Parser