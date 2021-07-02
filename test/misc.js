/* eslint-env mocha, es6 */

import assert from 'assert';
import markdown_it from '@gerhobbelt/markdown-it';



import plugin from '../index.js';


describe('coverage', function () {
  it('marker coverage', function () {
    const tok = markdown_it()
      .use(plugin, 'fox', {
        marker: 'foo',
        validate: function (p) {
          assert.equal(p, 'fox');
          return 1;
        }
      })
      .parse('foofoofoofox\ncontent\nfoofoofoofoo\n');

    assert.equal(tok[0].markup, 'foofoofoo');
    assert.equal(tok[0].info, 'fox');
    assert.equal(tok[4].markup, 'foofoofoofoo');
  });
});
