#!/usr/bin/env node
var fs = require('fs-extra');
var path = require('path');
var yargs = require('yargs');
var execa = require('execa');

const themeCollection = [
  'massively',
];

const spawn = (cmd) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, { stdio: `inherit` })
}

const clone = async (name, sysPath) => {
  const url = `https://github.com/gatsbymanor/gatsby-theme-${name}.git`;
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

const addThemeHandler = (argv) => {
  const themeName = argv.name;
  const themePagesDir = path.join(__dirname, `themes`, `${themeName}`);

  fs.ensureDir(themePagesDir)
    .then(() => {
      clone(themeName, themePagesDir);
    }).catch(err => {
      if (err) {
        console.log('Error: ', err);
        console.log('Makes sure you spelled the theme correctly.');
        return;
      }
    });

}

const mountThemeHandler = (argv) => {
  const themeName = argv.name;
  const themeDir = path.join(__dirname, `themes`, `${themeName}`);
  const target = path.join(__dirname, `src`);
  move(themeDir, target);
}

const unmountThemeHandler = (argv) => {
  const themeName = argv.name;
  const themeDir = path.join(__dirname, `themes`, `${themeName}`);
  const target = path.join(__dirname, `src`);
  move(target, themeDir);
}


const listThemesHandler = (argv) => {
  const themeName = argv.name;
  themeCollection.map(theme => {
    console.log(theme);
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
