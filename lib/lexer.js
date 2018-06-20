const Promise = require('bluebird');
const UnimplementedError = require('./unimplemented');

const TOKEN = Object.freeze({
  'ANY': 'ANY',
  'HEADER1' : 'HEADER1',
  'HEADER2' : 'HEADER2',
  'HEADER3' : 'HEADER3',
  'SPACEBREAK': 'SPACEBREAK',
  'LINEBREAK': 'LINEBREAK',
  'BLOCKQUOTE' : 'BLOCKQUOTE',
  'CODE' : 'CODE',
  'LIST' : 'LIST',
  'TASKLIST' : 'TASKLIST',
  'TABLE' : 'TABLE'
})

const REGEX = Object.freeze({
  'HEADER1': /^\s*#\s+(.*)/i, 
  'HEADER2': /^\s*##\s+(.*)/i, 
  'HEADER3': /^\s*###\s+(.*)/i, 
  'BLOCKQUOTE': /^\s*>\s+(.*)/i,
  'SPACEBREAK': /^(\s*)$/i,
  'LINEBREAK': /^\s*---(.*)\s*$/i
})

const REGEX_INLINE = Object.freeze({
  'BOLD': [/^\s*\*\*(.+)\*\*(.*)/i],
  'ITALIC': [/^\s*\*(.+)\*(.*)/i]
})

const TAG = Object.freeze({
  'HEADER1': ["<h1>","</h1><div>"],
  'HEADER2': ["<h2>","</h2><div>"],
  'HEADER3': ["<h3>","</h3><div>"],
  'BLOCKQUOTE': ["<code>","</code>"],
  'SPACEBREAK': ['<div class="space"/>',"</div>"],
  'LINEBREAK': ['<div class="horz-edge">',"</div>"],
  'BOLD': ['<b>','</b>'],
  'ITALIC': ['<italic>','</italic>']
})

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

  isLeavingOpenDiv(){
    return ['HEADER1','HEADER2','HEADER3'].indexOf(this.token) > -1
  }

  isValueParsable(){
    return ['HEADER1','HEADER2','HEADER3',
            'LINEBREAK','SPACEBREAK'].indexOf(this.token) == -1
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

  parseValue(){
    let output = '';
    let remain = this.value;
    while (remain.length > 0 && output.length == 0){
      if (!Object.keys(REGEX_INLINE).some(c => {
        return REGEX_INLINE[c].some(r => {
          console.log(`>> Parsing ${remain}`); // TAODEBUG:
          let m = remain.match(r)
          if (m){
            if (process.env.isDebug) console.log(`Inline token matched : ${c} => ${JSON.stringify(m)}`);

            let tagOpen = '';
            let tagClose = '';
            if (TAG[c]){
              [tagOpen, tagClose] = TAG[c];
            }
            output += `${tagOpen}${m[1]}${tagClose}`;
            remain = m[2];
            return true;
          }
          return false;
        })
      })){
        // Nothing matches
        output += remain;
        remain = '';
      }
    }
    return output;
  }

  toHtml(){
    let innerHtml = "";
    let tagOpen = "";
    let tagClose = "";
    if (this.token){
      if (TAG[this.token]){
        [tagOpen, tagClose] = TAG[this.token];
      }
      if (this.isValueParsable())
        innerHtml = this.parseValue() || "";
      else 
        innerHtml = this.value || "";
    }
    let isOpeningDiv = false;
    this.children.forEach(c => {
      if (c.isLeavingOpenDiv()){
        if (isOpeningDiv){
          // Close the open div before starting a new header
          innerHtml += "</div>";
        }
        isOpeningDiv = true;
      }
      innerHtml += c.toHtml()
    })
    if (isOpeningDiv) innerHtml += "</div>";
    return `${tagOpen}${innerHtml}${tagClose}\n`
  }
}

class Lexer {
  constructor(){}

  /**
   * Determine the semantic token from the text
   */
  matchToken(line){
    let token = TOKEN.ANY;
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
    return new ParseTree(token, value)
  }
}

module.exports = [ParseTree, Lexer];