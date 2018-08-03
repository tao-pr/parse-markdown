const [ParseTree, Lexer] = require('./lexer')
const UnimplementedError = require('./unimplemented')

class ParserState {
  constructor(){
    this.diagram = new ParseTree();
    this.lexer = new Lexer();
    this.cursor = this.diagram;
    this.var = {};
  }

  parseNextLine(line){
    var tree = this.lexer.tokenise(line)
    var prevToken = this.diagram.tokenOfLastChild();

    // If the new entry is a new list item,
    // push it into a new list container
    if (tree.token == 'LISTITEM'){
      if (prevToken == 'LIST'){
        this.cursor.children[this.cursor.children.length-1].add(tree)
      }
      else {
        // create a new list container
        var newList = new ParseTree('LIST');
        newList.add(tree);
        this.cursor.add(newList);
      }
    }
    else if (tree.token == 'VAR'){
      var [k,v] = tree.value;
      this.var[k] = v;
      console.log('VAR : ', k, ' => ', v); // TAODEBUG:
    }
    else {
      this.cursor.add(tree)
    }
  }

  resetCursor(){
    // Move the cursor back to the root
    this.cursor = this.diagram;
  }

  printTree(){ this.diagram.print() }

  renderAsHtml(){ return this.diagram.toHtml() }
}

module.exports = ParserState;