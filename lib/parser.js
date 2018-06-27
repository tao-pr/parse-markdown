const io = require('./io')
const Promise = require('bluebird')
const ParserState = require('./parser-state');
const Lexer = require('./lexer')

function parseWith(state){
  return function(line){
    if (process.env.isDebug) console.log(`Parsing : ${line}`);
    state.parseNextLine(line)
  }
}

function parse(promise){
  if (typeof promise == 'string') promise = Promise.resolve(promise);
  return promise.then((s) => {
    var arr = s.split('\n')
    let parserState = new ParserState();
    let prevEmpty = true;
    while (arr.length>0){
      let a = arr.shift().trim();
      if (!(prevEmpty && a.length == 0)){
        parseWith(parserState)(a);
      }
      prevEmpty = a.length == 0;
    }

    if (process.env.isDebug) parserState.printTree();
    return parserState.renderAsHtml();
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