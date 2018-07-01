# Parse Markdown

A lightweight Javascript library for parsing Markdown to HTML.

### Usage : Parse Markdown in your code

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

### Usage : Parse batch Markdown files

Execute following command:

```bash
  $ node markdown.js [inputPath] [outputPath]
```

Where `inputPath` contains the Markdown files.

### Licence

MIT