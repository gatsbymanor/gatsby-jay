const execa = require('execa');
const path = require('path');

const spawn = (cmd, options = {}) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, options)
}

const getLatestNpmPackageVersion = async (entry) => {
  try {
    let obj = {};
    const npmChildProcess = await spawn(`npm view ${entry} version`);
    obj[entry] = `^${npmChildProcess.stdout}`;
    return obj;
  } catch (e) {
    console.log(e);
  }
}

const createPackageJsonWithThemesDependencies = async (targetProjectPath) => {
  try {
    let themeSystemDependencies = {
      prodDependencies: [
        'gatsby-plugin-react-next',
        'gatsby-plugin-catch-links',
        'gatsby-plugin-sharp',
        'gatsby-plugin-sass',
        'gatsby-remark-images',
        'gatsby-transformer-remark',
        'gatsby-transformer-sharp',
        'gatsby-source-filesystem',
        'classnames',
      ],
      devDependencies: [
        'jest',
        'babel-preset-react',
        'babel-preset-es2015',
        'babel-polyfill',
        'babel-jest',
        'enzyme',
        'enzyme-adapter-react-16',
        'enzyme-to-json',
        'identity-obj-proxy',
        'react',
        'react-dom',
        'react-router-dom',
      ],
    };

    let prodDependenciesResults = [...themeSystemDependencies.prodDependencies].map(getLatestNpmPackageVersion);
    let allProductionDependencies = await Promise.all(prodDependenciesResults);

    let devDependenciesResults = [...themeSystemDependencies.devDependencies].map(getLatestNpmPackageVersion);
    let allDevDependencies = await Promise.all(devDependenciesResults);

    let partialPackageJson = {
      dependencies: Object.assign({}, ...allProductionDependencies),
      devDependencies: Object.assign({}, ...allDevDependencies),
    };

    let packagesJson = require(path.join(targetProjectPath, 'package.json'));
    Object.assign(packagesJson.dependencies, partialPackageJson.dependencies);
    Object.assign(packagesJson.devDependencies, partialPackageJson.devDependencies);

    return packagesJson;
  } catch (e) {
    console.log('Could not create theme system dependencies.', e);
  }
}

module.exports = createPackageJsonWithThemesDependencies;
