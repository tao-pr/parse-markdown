const io = require('./io')
const Promise = require('bluebird')

function parse(promise){
  if (typeof promise == 'string') promise = Promise.resolve(promise);
  // TAOTODO:
}

const Parser = {
  parseFile: function(filename){ return parse(io.read(filename)); },
  parseText: function(txtPromise){ return parse(txtPromise) }
}

module.exports = Parser