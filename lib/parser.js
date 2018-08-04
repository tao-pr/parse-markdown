const io = require('./io')
const Promise = require('bluebird')
const ParserState = require('./parser-state');
const Lexer = require('./lexer')

function parseWith(state){
  return function(line){
    if (process.env.isDebug) console.log(`Parsing : ${line}`);
    state.parseNextLine(line)
  }
}

function parse(promise, templatePath){
  if (typeof promise == 'string') promise = Promise.resolve(promise);
  return promise.then((s) => {
    var arr = s.split('\n')
    let parserState = new ParserState();
    let prevEmpty = true;
    while (arr.length>0){
      let a = arr.shift().trim();
      if (!(prevEmpty && a.length == 0)){
        parseWith(parserState)(a);
      }
      prevEmpty = a.length == 0;
    }

    if (process.env.isDebug) parserState.printTree();
    // Read the template file (if specified)
    // and render the output inside the template
    if (templatePath && typeof templatePath == 'string' && templatePath.trim().length > 0){
      return io.read(templatePath).then((template) => {
        var output = parserState.renderAsHtml()
        output = template.replace("@1", output);
        Object.entries(parserState.var).forEach((kv) => {
          var [k,v] = kv;
          console.log('Applying : ', k); // TAODEBUG:
          output = output.replace('@' + k, v);
        })
        return output;
      })
    }
    else
      return parserState.renderAsHtml()
  })
}

Promise.prototype.asHTMLFile = function(path){
  return this.then(io.writeToFile(path))
}

/**
 * All functions of [[Parser]] return [[Promise]]
 */
const Parser = {
  parseFile: function(filename, templateFile){ return parse(io.read(filename), templateFile); },
  parseText: function(txtPromise, templateFile){ return parse(txtPromise, templateFile) }
}

module.exports = Parser