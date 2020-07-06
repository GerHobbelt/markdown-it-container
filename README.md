# markdown-it-container

[![Build Status](https://img.shields.io/travis/GerHobbelt/markdown-it-container/master.svg?style=flat)](https://travis-ci.org/GerHobbelt/markdown-it-container)
[![NPM version](https://img.shields.io/npm/v/@gerhobbelt/markdown-it-container.svg?style=flat)](https://www.npmjs.org/package/@gerhobbelt/markdown-it-container)
[![Coverage Status](https://img.shields.io/coveralls/GerHobbbelt/markdown-it-container/master.svg?style=flat)](https://coveralls.io/r/GerHobbelt/markdown-it-container?branch=master)

> Plugin for creating block-level custom containers for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

__v2.+ requires `markdown-it` v10.+, see changelog.__

With this plugin you can create block containers like:

```
::: warning
*here be dragons*
:::
```

.... and specify how they should be rendered. If no renderer defined, `<div>` with
container name class will be created:

```html
<div class="warning">
<em>here be dragons</em>
</div>
```

Markup is the same as for [fenced code blocks](http://spec.commonmark.org/0.18/#fenced-code-blocks).
Difference is, that marker use another character and content is rendered as markdown markup.


## Installation

node.js, browser:

```bash
$ npm install @gerhobbelt/markdown-it-container --save
$ bower install @gerhobbelt/markdown-it-container --save
```


## API

```js
var md = require('@gerhobbelt/markdown-it')()
            .use(require('@gerhobbelt/markdown-it-container'), name [, options]);
```

Params:

- __name__ - container name (mandatory)
- __options:__
   - __validate__ - optional, function to validate tail after opening marker, should
     return `true` on success.
   - __render__ - optional, renderer function for opening/closing tokens.
   - __content__ - optional, renderer function for the container content.
   - __marker__ - optional (`:`), character/string to use in delimiter.
   - __endMarker__ - optional (default: same as __marker__), character/string to use in terminating delimiter. Specify when the closing mark differs from the starting mark of your container.
   - __minMarkerCount__ - optional (`3`), character/string repeated number to use in delimiter.


## Example

```js
var md = require('@gerhobbelt/markdown-it')();

md.use(require('@gerhobbelt/markdown-it-container'), 'spoiler', {

  validate: function(params) {
    return params.trim().match(/^spoiler\s+(.*)$/);
  },

  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';

    } else {
      // closing tag
      return '</details>\n';
    }
  }
});

console.log(md.render('::: spoiler click me\n*content*\n:::\n'));

// Output:
//
// <details><summary>click me</summary>
// <p><em>content</em></p>
// </details>
```

## Example with markdown-it-attrs

You can use [markdown-it-attrs](https://github.com/rstacruz/markdown-it-attrs) syntax like '#my-id.my-class title="hello"'

```js
var md = require('@gerhobbelt/markdown-it')();

md.use(require('@gerhobbelt/markdown-it-attrs'))
  .use(require('@gerhobbelt/markdown-it-container'), 'decorate' , {
            validate: function(params) {
                return params.trim().match(/^(.*)$/);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^(.*)$/);

                if (tokens[idx].nesting === 1) {
                    // opening tag
                    var fake=md.render('TMP_FOR_CONTAINER<!-- {'+ m[1]+'} -->')
console.log(fake)
                    return '<div '+ fake.substring(3,  fake.indexOf('>'))+'>\n';

                } else {
                    // closing tag
                    return '</div>\n';
                }
            }
   })
  

console.log(md.render('::: #n.ok title=hello\nccc\n:::'));

// Output:
// <div id="n" class="ok" title="hello">
// <p>ccc</p>
// </div>

```

## License

[MIT](https://github.com/GerHobbelt/markdown-it-container/LICENSE)
