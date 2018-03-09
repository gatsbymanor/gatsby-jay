#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const execa = require('execa');
const themesDependenciesPromise = require('./themes-dependencies');

const themeCollection = [
  'massively',
  'lens',
  'photon',
  'tessellate',
  'dimension',
  'identity',
  'stellar',
];

const spawn = (cmd, options = {}) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, options)
}

const clone = async (name, version, sysPath) => {
  const url = `https://github.com/gatsbymanor/gatsby-theme-${name}.git`;
  await spawn(`git clone -b ${version} ${url} ${sysPath}`);

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

const addThemeHandler = async (argv) => {
  const themeName = argv.name;
  const themePagesDir = path.join(`./`, `themes`, `${themeName}`);

  fs.ensureDir(themePagesDir)
    .then(() => {
      clone(themeName, "0.1.0", themePagesDir);
    }).catch(err => {
      if (err) {
        console.log('Error: ', err);
        console.log('Makes sure you spelled the theme correctly.');
        return;
      }
    });
}

  try {
    await fs.ensureDir(themePagesDir)
    clone(themeName, "0.2.0", themePagesDir);
  } catch (e) {
    console.log('Error: ', err);
    console.log('Makes sure you spelled the theme correctly.');
  }
}

// Follows a singleton pattern
const mountThemeHandler = async (argv) => {
  const themeName = argv.name;
  const targetThemePath = path.join(process.cwd(), `themes`, themeName);

  try {
    const exists = await fs.exists(targetThemePath)

    if (exists) {
      let targetProjectJayConfigPath = path.join(process.cwd(), `jay.json`);
      let targetProjectJayConfig = require(targetProjectJayConfigPath);
      targetProjectJayConfig.theme.name = themeName;
      writeJsonToFile(targetProjectJayConfigPath, targetProjectJayConfig, { spaceDelimiter: '  ' });

    } else {
      console.log('ErrorThe theme cannot be found. Did you add the theme to your project?');
    }
  } catch (e) {
    console.log('Could not find the file path in questions. jay.json might be missing.');
    console.log(e);
  }
}

const listThemesHandler = (argv) => {
  const themeName = argv.name;
  themeCollection.map(theme => {
    console.log(theme);
  });
}

const copyBootstrapFiles = (targetDir) => {
  const gatsbyJayTestFolderPath = path.join(__dirname, 'bootstrap');
  copy(gatsbyJayTestFolderPath, targetDir);
}

const removeDefaultGatsbyFiles = (projectDir) => {
  const srcFolder = path.join(projectDir, `src`);
  remove(srcFolder)
}

const createNewGatsbyProject = async (name) => {
  try {
    await spawn(`gatsby new ${name}`, { stdio: `inherit` });
  } catch (e) {
    console.log(`Error on create. Did you install gatsby-cli?`);
    console.log(`Try 'yarn global add gatsby-cli'`);
  }
}

const writeJsonToFile = async (filePath, jsonObject, options = {}) => {
  try {
    await fs.writeJson(filePath, jsonObject, {
      spaces: options.spaceDelimiter
    });
  } catch (e) {
    console.log('Problem writing json to file: ', e);
  }
}

const installThemeSystemDependencies = async (projectPath) => {
  try {
    let currentWorkingDir = process.cwd();
    let themesSystemDependencies = await themesDependenciesPromise(projectPath);

    writeJsonToFile(path.join(projectPath, `package.json`), themesSystemDependencies, { spaceDelimiter: '  ' });

    await process.chdir(`${projectPath}`);

    await spawn(`yarnpkg`, { stdio: `inherit` });

    await process.chdir(currentWorkingDir);


  } catch (e) {
    console.log(e);
  }
}


const initThemeHandler = async (argv) => {
  let projectName = argv.name;
  let targetProjectPath = path.join(process.cwd(), projectName);

  try {
    await createNewGatsbyProject(argv.name);

    removeDefaultGatsbyFiles(targetProjectPath);
    copyBootstrapFiles(targetProjectPath);
    installThemeSystemDependencies(targetProjectPath);

  } catch (err) {
    console.log('Error with initThemeHandler.', err);
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
    command: 'list',
    aliases: ['ls'],
    desc: 'List themes available',
    handler: listThemesHandler
  })
  .demandCommand()
  .help()
  .wrap(72)
  .argv
