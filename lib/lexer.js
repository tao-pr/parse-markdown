const Promise = require('bluebird');
const UnimplementedError = require('./unimplemented');

const PREDEF = {
  'parseSplit': function(v){
    var splitted = v.split(',')
    var toOption = (z) => `<option value="${z}"/>`
    return splitted.map(toOption).join('')
  }
}

const TOKEN = Object.freeze({
  'ANY': 'ANY',
  'VAR' : 'VAR',
  'HEADER1' : 'HEADER1',
  'HEADER2' : 'HEADER2',
  'HEADER3' : 'HEADER3',
  'HEADER4' : 'HEADER4',
  'HEADER5' : 'HEADER5',
  'HEADER6' : 'HEADER6',
  'SPACEBREAK': 'SPACEBREAK',
  'LINEBREAK': 'LINEBREAK',
  'BLOCKQUOTE' : 'BLOCKQUOTE',
  'CODE' : 'CODE',
  'LIST' : 'LIST',
  'TASKLIST' : 'TASKLIST',
  'TABLE' : 'TABLE',
  'LIST' : 'LIST',
  'LISTITEM' : 'LISTITEM',
  'IMG': 'IMG',
  'BUTTON': 'BUTTON',
  'DROPDOWN': 'DROPDOWN'
})

const REGEX = Object.freeze({
  'VAR': /^\s*\[(.*)\]\: \<\> \((.*)\)(.*)/i,
  'HEADER1': /^\s*#\s+(.*)/i,
  'HEADER2': /^\s*##\s+(.*)/i, 
  'HEADER3': /^\s*###\s+(.*)/i, 
  'HEADER4': /^\s*####\s+(.*)/i, 
  'HEADER5': /^\s*#####\s+(.*)/i, 
  'HEADER6': /^\s*######\s+(.*)/i, 
  'BLOCKQUOTE': /^\s*>\s+(.*)/i,
  'SPACEBREAK': /^(\s*)$/i,
  'LINEBREAK': /^\s*---(.*)\s*$/i,
  'LISTITEM': /^[-|*|+]\s*(.*)$/i
})

const REGEX_INLINE = Object.freeze({
  // 'VAR': [/(^|^.*\s+)\[(.*)\]\: \<\> \((.*)\)([\s+|\.\s*].*$|$)/i],
  'BOLD': [/(^|^.*\s+)\*\*(.+)\*\*([\s+|\.\s*].*$|$)/i, /(^|^.*\s+)\<b\>(.+)\<\/b\>([\s+|\.\s*].*$|$)/i],
  'ITALIC': [/(^|^.*\s+)\*(.+)\*([\s+|\.\s*].*$|$)/i],
  'INLINE_CODE': [/(^|^.*\s+)\`(.+)\`([\s+|\.\s*].*$|$)/i],
  'LINK': [/(^|^.*\s+)\[(.+)\]\((.+)\)(\s+.*$|$)/i],
  'SELFLINK': [/(^|^.*\s+)((http|https|ftp)\:\/\/[^\s]+)(\s+.*$|$)/i],
  'IMG': [/(^|^.*\s+)\!\[(.+)\]\((.+)\)([\s+|\.\s*].*$|$)/i],
  'BUTTON': [/(^|^.*\s+)\[button href="(.*)" caption="(.*)"\s*\]([\s+|\.\s*].*$|$)/i],
  'DROPDOWN': [/(^|^.*\s+)\[select id="(.+)" items="(.*)"\]([\s+|\.\s*].*$|$)/i]
})

const TAG = Object.freeze({
  'VAR': "", // {{VAR}} is invisible
  'HEADER1': "<h1>@1</h1><div>",
  'HEADER2': "<h2>@1</h2><div>",
  'HEADER3': "<h3>@1</h3><div>",
  'HEADER4': "<h4>@1</h4><div>",
  'HEADER5': "<h5>@1</h5><div>",
  'HEADER6': "<h6>@1</h6><div>",
  'BLOCKQUOTE': "<code>@1</code>",
  'SPACEBREAK': '</div><div class="top-margin">',
  'LINEBREAK': '<div class="horz-edge"></div>',
  'BOLD': '<b>@1</b>',
  'ITALIC': '<italic>@1</italic>',
  'INLINE_CODE': '<code class="inline">@1</code>',
  'LINK': '<a href="@2">@1</a>',
  'SELFLINK': '<a href="@1">@1</a>',
  'LIST': '<ul>@1</ul>',
  'LISTITEM': '<li>@1</li>',
  'IMG': '<img src="@2" alt="@1"/>',
  'BUTTON': '<button onclick="window.open(\'@1\',\'_blank\')">@2</button>',
  'DROPDOWN': '<select id="@1">{$parseSplit @2}</select>'
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

  insertAsFirst(tree){
    this.children.unshift(tree)
  }

  tokenOfLastChild(){
    if (this.children.length==0) return null;
    else return this.children[this.children.length-1].token;
  }

  getInnerMostCursor(){
    if (this.children.length == 0) return this
    else return this.children[this.children.length-1].getInnerMostCursor()
  }

  isLeavingOpenDiv(){
    return ['HEADER1','HEADER2','HEADER3','HEADER4','HEADER5','HEADER6'].indexOf(this.token) > -1
  }

  isValueParsable(){
    return ['HEADER1','HEADER2','HEADER3',
            'HEADER4','HEADER5','HEADER6',
            'LINEBREAK','SPACEBREAK','VAR'].indexOf(this.token) == -1
  }

  canBeSucceedBySpaceBreak(){
    return ['HEADER1','HEADER2','HEADER3','HEADER4','HEADER5','HEADER6',
            'LINEBREAK', 'SPACEBREAK'].indexOf(this.token) == -1
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

  parseValue(v){
    let output = '';
    let remain = v || this.value || '';
    while (remain.trim().length > 0){
      if (!Object.keys(REGEX_INLINE).some(c => {
        return REGEX_INLINE[c].some(r => {
          let m = remain.match(r)
          if (m){
            let w = m.slice(1)
            if (process.env.isDebug) console.log(`Inline token matched : ${c} => ${JSON.stringify(w)}`);

            // Replace VARS with their corresponding values
            let preMatch = (w[0].trim().length > 0) ? this.parseValue(w[0]) : w[0];
            let t = TAG[c]
            for (var i=1; i<w.length-1; i++)
              t = t.replace(new RegExp('@'+i, 'g'), w[i])

            // Parse value with predefined function
            let predef = t.match(/.*\{\$(\w+)\s+(.*)\}.*/);
            if (predef){
              let f = predef[1];
              let v = predef[2];
              t = t.replace(/(.*)(\{.*\})(.*)/, "$1" + PREDEF[f](v) + "$3")
            }

            output += `${preMatch}${t}`
            remain = w.pop()
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
    var t = "@1"
    if (this.token){
      t = TAG[this.token] || "@1"
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

    t = t.replace("@1", innerHtml)
    return `${t}\n`
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

        if (t == 'VAR'){
          let key = m[1].trim();
          let value = m[2].trim();
          token = 'VAR';
          v = [key, value];
          return true;
        }
        else {
          token = t;
          v = m[1].trim();
          return true;
        }
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