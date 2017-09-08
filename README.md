[![Build Status](https://travis-ci.org/pyriand3r/todo-parser.svg?branch=master)](https://travis-ci.org/pyriand3r/todo-parser) 
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=pyriand3r.todo-parser%3Amaster)](https://sonarcloud.io/dashboard?id=pyriand3r.todo-parser%3Amaster)
[![Code Coverage](https://sonarcloud.io/api/badges/measure?key=pyriand3r.todo-parser%3Amaster&metric=coverage)](https://sonarcloud.io/dashboard?id=pyriand3r.todo-parser%3Amaster)

# todo.txt parser

Converts [todo.txt files](http://todotxt.com) into javascript objects

## Install

Install via npm:

    npm i --save todo-parser

## Usage

> Right now you can parse todo.txt files and strings to js objects. The other way is right now not possible but coming soon!

### Single line parser

To parse a single todo.txt task line like this one:

    '(A) 2017-10-03 Write great readme @todo-parser +github'
 
 into its javscript object representation you can use the `Parser` class:

```javascript
const Parser = require('todo-parser').Parser;

let parser = new Parser();

let taskObject = parser.parse('(A) 2017-10-03 Write great readme @todo-parser +github');
```

Out comes a taskObject looking like this:

```javascript
{
    original: '(A) test message @todo-parser +github',
    priority: 'A',
    creationDate: Date('2017-10-03'),
    completionDate: null,
    description: 'test message',
    context: [ 'github' ],
    project: [ 'todo-parser' ],
    done: false
}

```

### File parser

To go nuts and parse a complete todo.txt file into an array of todo objects there is the `FileParser` class. In contrary to the `Parser` it works asynchronious and takes two arguments:

1. The file path to the todo.txt file
1. The callback to execute after parsing the file or an error occured

```javascript
const FileParser = require('todo-parser').FileParser;

let parser = new FileParser();

parser.parse('/home/someone/todos/myTodos.txt', function (err, data) {
    if (err) {
        //do something with the error
    }
    //do something with the todo task list data
});
```

### Custom parser

The package comes with a bunch of default parser for the standard todo.txt format. If you want to parse additional attributes like the popular `due:2017-10-12` you can register your own parsing methods.  
The method you provide will get passed the a data object you can modify and extend. It also contains the todo line to parse and looks like this:

```javascript
{
    original: '(A) test message @todo-parser +github',
    residue: ' test message  ',
    priority: 'A',
    creationDate: Date('2017-10-03'),
    completionDate: null,
    description: 'test message',
    context: [ 'github' ],
    project: [ 'todo-parser' ],
    done: false
}
```

The `data.original` attribute contains the complete todo.txt line.  
In the `residue` attribute a subset is stored from which all parsed attributes are removed. After all todo.txt parts are parsed it will be used as the `description`, so if you don't want your special attribute to appear in the todo description, remove it from the `residue` ;) .

To add a custom method to the Parser you can pass it via the `#register()` method.

So if you want to parse out the `due:2017-10-12` lines for example, you can register following method to the parser:

```javascript
let dueDateParser = function (data) {
    let match = data.original.match(/due:([0-9]{4}-[0-9]{2}-[0-9]{2})/)
    if (match !== null) {
        data.dueDate = new Date(match[1])
        data.residue = data.residue.override(match[1], '')
    }
}
parser.register(dueDateParser)
let data = parser.parse('(A) 2017-10-01 Something to do due:2017-10-30')
let expected = new Date('2017-10-30')
assert.equal(data.dueDate.getDate(), expected.getDate())
```

### Override default parser

If you don't like the way todo-parser parses the default values you can override the standard parser with your own methods. I wouldn't like that but I give you the opportunity to do it so I shouldn't moan about it ;)

So if you want to do this blasphemy you can register your own method with the `parser.override(name, method)` function.

There are 7 default parser:

- done
- priority
- creationDate
- completionDate
- context
- project
- description

The override method takes two arguments:

1. The name of the default parser to override
2. The method to use instead

```javascript
let yourOwnPriorityParser = function (data) {
    //do something
}
parser.override('priority', yourOwnPriorityParser)
```
