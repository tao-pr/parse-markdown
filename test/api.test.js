const assert = require('assert')

const Parser = require('../markdown.js');

describe('Parser Interface', () => {
  beforeEach(() => {})

  it('should export the proper API', () => {
    expect(Object.keys(Parser)).toEqual(expect.arrayContaining(['parseFile','parseText']));
    expect(typeof Parser.parseFile).toBe('function');
    expect(typeof Parser.parseText).toBe('function');
  })

  it('should parse text', () => {

  })

  it('should parse file', () => {})
})