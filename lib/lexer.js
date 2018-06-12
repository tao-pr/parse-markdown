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
  'HEADER': /^\s*#+\s+(.*)/i, 
  'BLOCKQUOTE': /^\s*>\s+(.*)/i
})

const TAG = Object.freeze({
  'HEADER': ["<h1>","</h1>"],
  'BLOCKQUOTE': ["<code>","</code>"]
})

// TAOTODO: Inline parsable REGEXes here

class ParseTree {
  constructor(token, valu, style){
    this.token = token;
    this.value = valu || "";
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
    if (this.token){
      let padStr = "";
      Array.from({length: padding}).forEach(_ => padStr + " ");
      console.log(`${padStr}- ${this.token} : ${this.value}`);  
    }
    this.children.forEach(c => c.print(padding + 2))
  }

  toHtml(){
    let innerHtml = "";
    let tagOpen = "";
    let tagClose = "";
    if (this.token){
      if (TAG[this.token]){
        [tagOpen, tagClose] = TAG[this.token];
      }
      innerHtml = this.value || "";
    }
    this.children.forEach(c => innerHtml += c.toHtml())
    return `${tagOpen}${innerHtml}${tagClose}\n`
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
    let token = TOKEN.PARAGRAPH; // By default, nothing special is interpreted as a paragraph
    let v = line.trim();
    Object.keys(REGEX).some( t => {
      let m = line.match(REGEX[t]);
      if (m){
        if (process.env.isDebug) console.log(`Token matched : ${t} => ${JSON.stringify(m)}`);

        token = t;
        v = m[1].trim();
        // TAOTODO: Take style from the parsed param (if any)
        return true;
      }
      else return false;
    })
    return [token, v]
  }

  tokenise(line){
    let [token,value] = this.matchToken(line)
    // TAOTODO: Recursively parse the [value] here ?
    return new ParseTree(token, value)
  }
}

module.exports = [ParseTree, Lexer];