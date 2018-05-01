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

  add(childToken, val){
    this.children.push(new ParseTree(childToken, val));
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

  tokenise(line){
    let token = null;
    let value = null;
    throw new UnimplementedError("Lexer.tokenise");
    return [token, value]
  }
}

module.exports = Lexer