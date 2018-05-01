const Lexer = require('./lexer')
const UnimplementedError = require('unimplemented')

class ParserState {
  constructor(){
    this.diagram = new ParseTree();
    this.lexer = new Lexer();
    this.cursor = this.diagram;
  }

  parseNextLine(line){
    throw new UnimplementedError("ParserState.parseNextLine")
  }

  resetCursor(){
    // Move the cursor back to the root
    this.cursor = this.diagram;
  }

  printTree(){ this.diagram.print() }
}

module.exports = ParserState;