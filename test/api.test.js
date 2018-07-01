const assert = require('assert')

const Parser = require('../markdown.js');
const io = require('../lib/io.js');
const fs = require('fs');

String.prototype.strip = function(){
  var str = this.valueOf();
  var trim = (a) => a.trim();
  return str.split('\n').map(trim).join('');
}

describe('Parser Interface', () => {
  beforeEach(() => {
    // process.env.isDebug = true;
  })

  it('should export the proper API', () => {
    expect(Object.keys(Parser)).toEqual(expect.arrayContaining(['parseFile','parseText']));
    expect(typeof Parser.parseFile).toBe('function');
    expect(typeof Parser.parseText).toBe('function');
  })

  it('should parse text', (done) => {
    let txt = `# Headline
    ## 2nd headline
    woooh <b>bold</b>
    #### header #4
    lastline`;
    
    let output = `<h1>Headline</h1><div>
    </div><h2>2nd headline</h2>
    <div>woooh <b>bold</b></div>
    <h4>header #4</h4>
    <div>lastline</div>`
    .strip();

    Parser.parseText(txt).then((actual) => {
      expect(actual.strip()).toEqual(output);  
      done();
    })
  })

  it('should parse file', (done) => {
    let mdFile = './samples/primitive.md';
    let outputP = io.read('./samples/primitive.html');

    Parser.parseFile(mdFile).then((actual) => {
      outputP.then(output => {
        expect(actual.strip()).toEqual(output.strip());
        done();
      })
    })
  })

  it('should write a parsed output to a file', (done) => {
    let txt = `
    #### Header @
    unknown paragraph and http://link`;
    
    let output = `
     <h4>Header @</h4><div>
      unknown paragraph and <a href="http://link">http://link</a>
      </div>
      </div><div class="top-margin">`.strip();

    let outputFile = './samples/volatileOutput.html';

    var deleteFile = function(){
      return new Promise((done,reject) => {
        fs.unlink(outputFile, (err) => {
          // Suppress IO error
          done(outputFile);
        })
      })
    }

    deleteFile()
      .then((_) => Parser.parseText(txt).asHTMLFile(outputFile)) // Save parsed Markdown as HTML file
      .then(Parser.parseFile) // Read HTML back in
      .then((html) => {
        expect(html.strip()).toEqual(output)
      })
      .then(deleteFile)
      .then((_) => done())
  })
})