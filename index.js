#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const execa = require('execa');
const registry = require('gatsby-jay-registry');

const spawn = (cmd) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, { stdio: `inherit` })
}

const clone = async (url, sysPath) => {
  await spawn(`git clone ${url} ${sysPath}`);

  await fs.remove(path.join(sysPath, `.git`));
}

const copy = async (src, dest) => {
  try {
    await fs.copy(src, dest);
  } catch (e) {
    console.log('Copy Error: ', e);
  }
}

const move = async (src, dest) => {
  try {
    await fs.move(src, dest);
  } catch (e) {
      console.log('Move Error: ', e);
  }
}

const remove = async (name, sysPath) => {
  await fs.remove(sysPath);
  console.log(`${name} theme has been removed.`);
}

const addThemeHandler = async ({name}) => {
  const theme = registry.find(theme => theme.name === name);

  if (theme) {
    const themePagesDir = path.join(`./`, `themes`, `${name}`);

    await fs.ensureDir(themePagesDir);
    await clone(theme.url, themePagesDir);
    // bootstrapping has to happen then
  } else {
    console.log(`${name} not found in the registry`);
  }
}

const mountThemeHandler = (argv) => {
  const themeName = argv.name;
  const themeDir = path.join(`./`, `themes`, `${themeName}`);
  const target = path.join(`./`, `src`);
  move(themeDir, target);
}

const unmountThemeHandler = (argv) => {
  const themeName = argv.name;
  const themeDir = path.join(`./`, `themes`, `${themeName}`);
  const target = path.join(`./`, `src`);
  move(target, themeDir);
}

const listThemesHandler = (argv) => {
  registry.map(theme => {
    console.log(
      `
  ${theme.name}
  ${theme.description}

  Available content sources:
  ${theme.contentSources.map(source => ` - ${source}`)}
      `
    )
  });
}

yargs
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
    command: 'unmount <name>',
    aliases: [],
    desc: 'Unmount <name> as the default theme. Moves theme to themes/',
    handler: unmountThemeHandler
  })
  .command({
    command: 'update <name>',
    aliases: [],
    desc: 'Update <name> from Github. Coming soon.',
    handler: (argv) => {}
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
