/**
 * Parse Markdown
 * -----------------------------
 * @author TaoPR (github.com/starcolon)
 */

const Parser = require('./lib/parser')
var colors   = require('colors');
var fs       = require('fs');
var args     = process.argv.slice(2);

if (require.main === module) {
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

    fs.readdir(inputPath, (error,files) => {
      var batch = [];
      files.forEach((fpath) => {
        var inputFile = fpath.toLowerCase()
        if (inputFile.match(/^(.+)\.md$/)){
          console.log('... Parsing : ', inputFile);
          var fullInputPath = inputPath + '/' + inputFile; 
          var fullOutputPath = outputPath + '/' + inputFile.replace(/\.md$/, '.html');
          batch.push(Parser.parseFile(fullInputPath).asHTMLFile(fullOutputPath));
        }
      })

      // Wait until all batch process is complete
      Promise.all(batch).then(() => {
        console.log('All files are parsed.'.green);
        process.exit(0);
      })
    })
  })() 
} else {
  module.exports = Parser
}

