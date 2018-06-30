# Parse Markdown

A lightweight Javascript library for parsing Markdown to HTML.

### Usage

Parsing Markdown string

```
var Parser = require('./markdown')
Parser.parseText('## Header\nLine `quote`').then((htmlOutput) => ...)
```

Parsing a Markdown file

```
var Parser = require('./markdown')
Parser.parseFile('./file.md').then((htmlOutput) => ...)
```

### Licence

MIT