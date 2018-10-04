const assert = require('assert')

const Parser = require('../markdown.js');
const io = require('../lib/io.js');
const fs = require('fs');

function strip(str) {
  var trim = (a) => a.trim();
  return str.split('\n').map(trim).join('');
}

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
    
    let output = strip(`<h1>Headline</h1><div>
    </div><h2>2nd headline</h2>
    <div>woooh <b>bold</b></div>
    <h4>header #4</h4>
    <div>lastline</div>`);

    Parser.parseText(txt).then((actual) => {
      expect(strip(actual)).toEqual(output);  
      done();
    })
  })

  it('should parse text with template', (done) => {
    let templateFile = './samples/html/template.html'
    let txt = `[tag]: <> (tag value goes here)
    # Headline
    ## 2nd headline
    woooh <b>bold</b>
    #### header #4
    lastline`;

    let template = strip(`
      <html>
      <head>
        <title>headline</title>
        <tag>@tag</tag>
      </head>
      <body>
        @1
      </body>
      </html>
    `);
    
    let output = strip(`<h1>Headline</h1><div>
    </div><h2>2nd headline</h2>
    <div>woooh <b>bold</b></div>
    <h4>header #4</h4>
    <div>lastline</div>`);

    Parser.parseText(txt, templateFile).then((actual) => {
      expect(strip(actual)).toEqual(template
        .replace('@1', output)
        .replace('@tag', 'tag value goes here'));  
      done();
    }) 
  })

  it('should parse with predefined function', (done) => {
    let txt = `# untitled
    text here
    [select id="hey" items="a,b,cc,d,ee"]`;

    let output = `<h1>untitled</h1>
    <div>text here
    <select id="hey">
    <option value="a">a</option>
    <option value="b">b</option>
    <option value="cc">cc</option>
    <option value="d">d</option>
    <option value="ee">ee</option>
    </select>
    </div>`

    Parser.parseText(txt).then((actual) => {
      expect(strip(actual)).toEqual(strip(output))
      done();
    })
  })

  it('should parse file', (done) => {
    let mdFile = './samples/primitive.md';
    let outputP = io.read('./samples/primitive.html');

    Parser.parseFile(mdFile).then((actual) => {
      outputP.then(output => {
        expect(strip(actual)).toEqual(strip(output));
        done();
      })
    })
  })

  it('should write a parsed output to a file', (done) => {
    let txt = `
    #### Header @
    unknown paragraph and http://link with *italic text*.`;
    
    let output = strip(`
     <h4>Header @</h4><div>
      unknown paragraph and <a href="http://link">http://link</a> with <italic>
      italic text</italic>.
      </div>
      </div><div class="top-margin">`);

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
        expect(strip(html)).toEqual(output)
      })
      .then(deleteFile)
      .then((_) => done())
  })
})