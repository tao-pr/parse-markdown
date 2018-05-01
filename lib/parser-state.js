const Lexer = require('./lexer')

class ParserState {
  constructor(){
    this.cursor = null;
    this.diagram = new ParseTree();
    this.lexer = new Lexer();
  }

  parseInline(line){}

  parseNextLine(line){
    let line_ = ??? // TAOTODO: Strip the continuous block as seen from [stack]
    let pline = parseInline(line_)
  } // TAOTODO:

  clear(){ this.stack = [] }
}

module.exports = ParserState;