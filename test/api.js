/* eslint-env mocha, es6 */

import assert from 'assert';
import markdown_it from '@gerhobbelt/markdown-it';

import plugin from '../index.js';


describe('api', function () {
  it('container renderer', function () {
    const res = markdown_it()
      .use(plugin, 'spoiler', {
        render: function (tokens, idx) {
          return tokens[idx].nesting === 1
            ? '<details><summary>click me</summary>\n'
            : '</details>\n';
        }
      })
      .render('::: spoiler\n*content*\n:::\n');

    assert.equal(res, '<details><summary>click me</summary>\n<p><em>content</em></p>\n</details>\n');
  });

  it('content renderer', function () {
    const res = markdown_it()
                .use(plugin, 'spoiler', {
                  content: function (tokens, idx) {
                    return '<mark>' + tokens[idx].markup + '</mark>';
                  }
                })
                .render('::: spoiler\n*content*\n*with spoiler*\n:::\n');

    assert.equal(res, '<div class="spoiler">\n<mark>\n*content*\n*with spoiler*\n</mark></div>\n');
  });

  it('2 char marker', function () {
    const res = markdown_it()
      .use(plugin, 'spoiler', {
        marker: '->'
      })
      .render('->->-> spoiler\n*content*\n->->->\n');

    assert.equal(res, '<div class="spoiler">\n<p><em>content</em></p>\n</div>\n');
  });

  it('2 char 4 repeated marker', function () {
    const res = markdown_it()
      .use(plugin, 'spoiler', {
        marker: '->',
        minMarkerCount: 4
      })
      .render('->->->-> spoiler\n*content*\n->->->->\n');

    assert.equal(res, '<div class="spoiler">\n<p><em>content</em></p>\n</div>\n');
  });

  it('marker should not collide with fence', function () {
    const res = markdown_it()
      .use(plugin, 'spoiler', {
        marker: '`'
      })
      .render('``` spoiler\n*content*\n```\n');

    assert.equal(res, '<div class="spoiler">\n<p><em>content</em></p>\n</div>\n');
  });

  it('marker should not collide with fence #2', function () {
    const res = markdown_it()
      .use(plugin, 'spoiler', {
        marker: '`'
      })
      .render('\n``` not spoiler\n*content*\n```\n');

    assert.equal(res, '<pre><code class="language-not">*content*\n</code></pre>\n');
  });

  describe('validator', function () {
    it('should skip rule if return value is falsy', function () {
      const res = markdown_it()
        .use(plugin, 'name', {
          validate: function () { return false; }
        })
        .render(':::foo\nbar\n:::\n');

      assert.equal(res, '<p>:::foo\nbar\n:::</p>\n');
    });

    it('should accept rule if return value is true', function () {
      const res = markdown_it()
        .use(plugin, 'name', {
          validate: function () { return true; }
        })
        .render(':::foo\nbar\n:::\n');

      assert.equal(res, '<div class="name">\n<p>bar</p>\n</div>\n');
    });

    it('rule should call it', function () {
      let count = 0;

      markdown_it()
        .use(plugin, 'name', {
          validate: function () { count++; }
        })
        .parse(':\n::\n:::\n::::\n:::::\n', {});

      // called by paragraph and lheading 3 times each
      assert(count > 0);
      assert(count % 3 === 0);
    });

    it('should not trim params', function () {
      markdown_it()
        .use(plugin, 'name', {
          validate: function (p) { assert.equal(p, ' \tname '); return 1; }
        })
        .parse('::: \tname \ncontent\n:::\n', {});
    });

    it('should allow analyze mark', function () {
      const md = markdown_it()
        .use(plugin, 'name', {
          validate: function (__, mark) { return mark.length >= 4; }
        });

      assert.equal(md.render(':::\nfoo\n:::\n'), '<p>:::\nfoo\n:::</p>\n');
      assert.equal(md.render('::::\nfoo\n::::\n'), '<div class="name">\n<p>foo</p>\n</div>\n');
    });

  });
});
