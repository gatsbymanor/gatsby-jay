const path = require('path');
const jayConfig = require('./jay.json');

exports.getGatsbyConfig = () => {
  const themeName = jayConfig['theme']['name']
  const gatsbyConfigPath = path.join(__dirname, `themes`, themeName, `jay-config.js`);

  try {
    const gatsbyConfig = require(gatsbyConfigPath);
    return gatsbyConfig;
  } catch (e) {
    const message = `gatsby-jay -> The requested theme probably does not exist.\n
      Add the missing theme or mount an existing theme from the themes folder.`
    throw Error(message);
  }
}

exports.getGatsbyNodeCreatePages = () => {
  const themeName = jayConfig['theme']['name']
  const gatsbyNodePath = path.join(__dirname, `themes`, themeName, `jay-node.js`);

  try {
    const gatsbyNode = require(gatsbyNodePath).createPages;
    return gatsbyNode
  } catch (e) {
    const message = `gatsby-jay -> The requested theme probably does not exist. \n
      Add the missing theme or mount an existing theme from the themes folder.`
    throw Error(message);
  }
}
