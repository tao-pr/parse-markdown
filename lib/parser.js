const io = require('./io')
const Promise = require('bluebird')
const ParserState = require('./parser-state');
const Lexer = require('./lexer')

function parseWith(state){
  return function(line){
    return state.parseNextLine(line)
  }
}

function parse(promise){
  if (typeof promise == 'string') promise = Promise.resolve(promise);
  return promise.then((s) => {
    var arr = s.split('\n').filter((n) => n.trim().length == 0);
    let parserState = new ParserState();
    return arr.map(parseWith(parserState))
  })
}

/**
 * All functions of [[Parser]] return [[Promise]]
 */
const Parser = {
  parseFile: function(filename){ return parse(io.read(filename)); },
  parseText: function(txtPromise){ return parse(txtPromise) }
}

module.exports = Parser