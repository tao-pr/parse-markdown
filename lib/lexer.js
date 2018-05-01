const Promise = require('bluebird')
const UnimplementedError = require('unimplemented')

const TOKEN {
  PARAGRAPH = 'PARAGRAPH', // Syntactially a content
  HEADER = 'HEADER',
  BLOCKQUOTE = 'BLOCKQUOTE',
  CODE = 'CODE',
  LIST = 'LIST',
  TASKLIST = 'TASKLIST',
  TABLE = 'TABLE'
}

class ParseTree {
  constructor(token, valu, style){
    this.token = token;
    this.value = valu;
    this.style = style || null;
    this.children = [];
  }

  add(tree){
    this.children.push(tree);
  }

  getInnerMostCursor(){
    if (this.children.length == 0) return this
    else return this.children[this.children.size-1].getInnerMostCursor()
  }

  print(padding){
    padding = padding || 0;
    throw new UnimplementedError("ParseTree.print");
  }
}


// TAOTODO: inline tokens
// - Formatting eg. bold, italic, etc
// - Inline code
// - Links
// - Images
// - 

class Lexer {
  constructor(){}

  getLineTokenType(line){}

  /**
   * Strip token markers or symbolic tokens out of a line
   */
  stripMarkers(line, token){}

  tokenise(line){
    let token = getLineTokenType(line)
    let value = stripMarkers(line, token)
    return new ParseTree(token, value)
  }
}

module.exports = Lexer