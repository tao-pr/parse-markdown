const [ParseTree, Lexer] = require('./lexer')
const UnimplementedError = require('./unimplemented')

class ParserState {
  constructor(){
    this.diagram = new ParseTree();
    this.lexer = new Lexer();
    this.cursor = this.diagram;
  }

  parseNextLine(line){
    var tree = this.lexer.tokenise(line)
    this.cursor.add(tree)
  }

  resetCursor(){
    // Move the cursor back to the root
    this.cursor = this.diagram;
  }

  printTree(){ this.diagram.print() }

  renderAsHtml(){
    return ""
  } // TAOTODO:
}

module.exports = ParserState;