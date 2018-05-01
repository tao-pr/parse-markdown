const Promise = require('bluebird')

const TOKEN {
  PARAGRAPH = 0, // Syntactially a content
  HEADER = 100,
  BLOCKQUOTE = 200,
  CODE = 300,
  LIST = 400,
  TASKLIST = 500,
  TABLE = 600
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
}


// TAOTODO: inline tokens
// - Formatting eg. bold, italic, etc
// - Inline code
// - Links
// - Images
// - 

class Lexer {
  constructor(){}

  tokenise(line){}
}

module.exports = Lexer