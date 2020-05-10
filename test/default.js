'use strict';


let path     = require('path');
let generate = require('@gerhobbelt/markdown-it-testgen');

/*eslint-env mocha*/

describe('default container', function () {
  let md = require('@gerhobbelt/markdown-it')()
              .use(require('../'), 'name');

  generate(path.join(__dirname, 'fixtures/default.txt'), md);
});
