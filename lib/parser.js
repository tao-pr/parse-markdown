const io = require('./io')

function parse(md){
  // TAOTODO:
}

const Parser = {
  parseFile: function(filename){ return parse(io.read(filename)); },
  parseText: function(txt){ return parse(txt) }
}

module.exports = Parser