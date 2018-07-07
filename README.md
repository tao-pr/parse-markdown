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

### Usage : Recursively parse Markdown files in subdirectories

Execute the script as follow to run through the subdirectories recursively.
The script produces the output in the same directory structure as inputs in the specified output directory.

```bash
  $ ./compile.sh [inputRootPath] [outputRootPath]
```

Where `inputPath` contains the Markdown files.

### Licence

MIT