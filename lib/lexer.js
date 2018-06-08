const Promise = require('bluebird');
const UnimplementedError = require('./unimplemented');

const TOKEN = Object.freeze({
  'PARAGRAPH' : 'PARAGRAPH', // Syntactially a content
  'HEADER' : 'HEADER',
  'BLOCKQUOTE' : 'BLOCKQUOTE',
  'CODE' : 'CODE',
  'LIST' : 'LIST',
  'TASKLIST' : 'TASKLIST',
  'TABLE' : 'TABLE'
})

const REGEX = Object.freeze({
  'HEADER': /^\s*#+\s+(.*)/, 
  'BLOCKQUOTE': /^\s*>\s+(.*)/
})

// TAOTODO: Inline parsable REGEXes here

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

  /**
   * Determine the semantic token from the text
   */
  matchToken(line){
    let token = TOKEN.PARAGRAPH;
    let v = line;
    Object.keys(REGEX).some( t => {
      let m = line.match(REGEX[t]);
      if (m){
        token = t;
        v = m[1];
        // TAOTODO: Take style from the parsed param (if any)
        return true;
      }
      else return false;
    })
    return [token, v]
  }

  tokenise(line){
    let [token,value] = matchToken(line)
    // TAOTODO: Recursively parse the [value] here ?
    return new ParseTree(token, value)
  }
}

module.exports = [ParseTree, Lexer];