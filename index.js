#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const execa = require('execa');
const config = require('./jay-config');

const themeCollection = [
  'massively',
  'lens',
  'photon',
  'tessellate',
  'dimension',
  'identity',
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

const remove = async (sysPath) => {
  try {
    await fs.remove(sysPath);
  } catch (err) {
    console.log(`Error: ${sysPath} NOT removed.`);
    console.log(`Error: ${err}`);
  }
}

const addThemeHandler = (argv) => {
  const themeName = argv.name;
  const themePagesDir = path.join(`./`, `themes`, `${themeName}`);

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
  const themeName = argv.name;
  themeCollection.map(theme => {
    console.log(theme);
  });
}

const installPackages = async (dependencies, flags = '') => {
  let packages = [];
  Object.keys(dependencies).forEach((item) => {
    let entry = dependencies[item];
    packages = [...packages, ...entry];
  });

  packages = packages.join(' ');
  await spawn(`yarnpkg add ${flags} ${packages}`);
}

const changeCurrentWorkingDirToNewProject = async (projectPath) => {
  await process.chdir(path.join(process.cwd(), `${projectPath}`));
}

const copyBootstrapFiles = () => {
  const targetDir = path.join(process.cwd());
  const gatsbyJayTestFolderPath = path.join(__dirname, 'bootstrap');
  copy(gatsbyJayTestFolderPath, targetDir);
}


const removeDefaultGatsbyFiles = () => {
  remove(path.join(process.cwd(), 'gatsby-config.js'));
  remove(path.join(process.cwd(), 'gatsby-node.js'));
}

const createNewGatsbyProject = async (name) => {
  try {
    await spawn(`gatsby new ${name}`);
  } catch (e) {
    console.log(`Error on create. Did you install gatsby-cli?`);
    console.log(`Try 'yarn global add gatsby-cli'`);
  }
}

const initThemeHandler = async (argv) => {
  try {
    await createNewGatsbyProject(argv.name);

    await changeCurrentWorkingDirToNewProject(argv.name);
    await removeDefaultGatsbyFiles();

    await installPackages(config.devDependencies, '--dev');
    await installPackages(config.prodDependencies);

    await copyBootstrapFiles();

  } catch (err) {
    console.log('Error with initThemeHandler.');
  }
}

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
