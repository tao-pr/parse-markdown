const assert = require('assert')

const Parser = require('../markdown.js');
const io = require('../lib/io.js');

describe('Parser Interface', () => {
  beforeEach(() => {})

  it('should export the proper API', () => {
    expect(Object.keys(Parser)).toEqual(expect.arrayContaining(['parseFile','parseText']));
    expect(typeof Parser.parseFile).toBe('function');
    expect(typeof Parser.parseText).toBe('function');
  })

  it('should parse text', (done) => {
    let txt = `# Headline
    ## 2nd headline
    woooh
    lastline`;
    
    let output = `<h1>Headline</h1>
    <h2>2nd headline woooh
    lastline`;

    Parser.parseText(txt).then((actual) => {
      expect(actual).toEqual(output);  
      done();
    })
  })

  it('should parse file', () => {
    let mdFile = '../samples/primitive.md';
    let output = io.read('../samples/primitive.html');

    Parser.parseFile(mdFile).then((actual) => {
      expect(actual).toEqual(output);
      done();
    })
  })
})