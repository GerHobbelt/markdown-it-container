'use strict';


var path     = require('path');
var generate = require('@gerhobbelt/markdown-it-testgen');

/*eslint-env mocha*/

describe('default container', function () {
  var md = require('@gerhobbelt/markdown-it')()
              .use(require('../'), 'name');

  generate(path.join(__dirname, 'fixtures/default.txt'), md);
});
