/**
 * Parse Markdown
 * -----------------------------
 * @author TaoPR (github.com/starcolon)
 */

const Parser = require('./lib/parser')
var colors   = require('colors');
var args     = process.argv.slice(2);

(function (){
  // Read arguments
  if (args.length < 2){
    console.warn('Expect 2 arguments: markdown.js [inputPath] [outputPath]');
    return process.exit(0);
  }

  // Start the parsing job
  var [inputPath, outputPath] = args;
  console.log('Input path: '.cyan, inputPath);
  console.log('outputPath path : '.cyan, outputPath);

  // Finish

})()

module.exports = Parser