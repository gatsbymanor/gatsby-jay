const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

const spawn = (cmd, options = {}) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, options)
}

const clone = async (name, sysPath) => {
  const url = `https://github.com/gatsbymanor/gatsby-theme-${name}.git`;
  await spawn(`git clone ${url} ${sysPath}`, { stdio: `inherit` });

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

const writeJson = async (filePath, jsonObject, options = {}) => {
  try {
    await fs.writeJson(filePath, jsonObject, {
      spaces: options.spaceDelimiter
    });
  } catch (e) {
    console.log('Problem writing json to file: ', e);
  }
}

export {
  spawn,
  clone,
  copy,
  move,
  remove,
  writeJson,
}
