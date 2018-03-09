const fs = require('fs-extra');
const path = require('path');
const themesDependenciesPromise = require('./themes-dependencies');



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


export const initThemeHandler = async (argv) => {
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
