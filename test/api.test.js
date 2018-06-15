const assert = require('assert')

const Parser = require('../markdown.js');
const io = require('../lib/io.js');

String.prototype.strip = function(){
  var str = this.valueOf();
  var trim = (a) => a.trim();
  return str.split('\n').map(trim).join('');
}

describe('Parser Interface', () => {
  beforeEach(() => {
    process.env.isDebug = true;
  })

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
    <h2>2nd headline</h2>
    woooh
    lastline`
    .strip();

    Parser.parseText(txt).then((actual) => {
      expect(actual.strip()).toEqual(output);  
      done();
    })
  })

  it('should parse file', (done) => {
    let mdFile = '../samples/primitive.md';
    let output = io.read('../samples/primitive.html');

    Parser.parseFile(mdFile).then((actual) => {
      expect(actual).toEqual(output);
      done();
    })
  })
})