#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');




yargs
  .command({
    command: 'init <name>',
    aliases: [],
    desc: 'Start a new theme enabled Gatsby project',
    handler: initThemeHandler
  })
  .command({
    command: 'add <name>',
    aliases: [],
    desc: 'Install the theme specified by name',
    handler: addThemeHandler
  })
  .command({
    command: 'mount <name>',
    aliases: [],
    desc: 'Use <name> as the default theme. Moves theme to src/pages',
    handler: mountThemeHandler
  })
  .command({
    command: 'list',
    aliases: ['ls'],
    desc: 'List themes available',
    handler: listThemesHandler
  })
  .demandCommand()
  .help()
  .wrap(72)
  .argv
