#!/usr/bin/env node
/*eslint no-console:0*/

'use strict';

let argparse = require('argparse');
let pkg = require('../package.json');


let cli = new argparse.ArgumentParser({
  prog: 'getGlobalName',
  version: require('../package.json').version,
  addHelp: true
});

cli.addArgument([ 'type' ], {
  help: 'type of name/string to produce',
  nargs: '?',
  choices: [ 'global', 'package', 'version' ]
});

let options = cli.parseArgs();

////////////////////////////////////////////////////////////////////////////////

switch (options.type) {
default:
  cli.exit(1, cli.formatHelp());
  break;

case 'version':
  cli.exit(0, pkg.version);
  break;

case 'package':
  cli.exit(0, pkg.name.replace(/^.*?\//, ''));
  break;

case 'global':
  let name = pkg.name.replace(/^.*?\//, '');
  name = name.replace('markdown-it', 'markdownit').replace(/-([a-z])/g, function (m, p1) {
    return p1.toUpperCase();
  });
  cli.exit(0, name);
  break;
}
