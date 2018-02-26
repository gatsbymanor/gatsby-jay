module.exports = {
  prodDependencies: {
    gatsbyPluginsRequirements: [
      'gatsby-plugin-react-next',
      'gatsby-plugin-catch-links',
      'gatsby-plugin-sharp',
      'gatsby-plugin-sass',
      'gatsby-remark-images',
      'gatsby-transformer-remark',
      'gatsby-source-filesystem',
    ],
    themeRequirements: [
      'classnames',
    ]
  },
  devDependencies: {
    jestRequirements: [
      'jest',
      'babel-preset-react',
      'babel-preset-es2015',
      'babel-polyfill',
      'babel-jest',
    ],
    enzymeRequirements: [
      'enzyme',
      'enzyme-adapter-react-16',
      'enzyme-to-json',
      'identity-obj-proxy',
    ],
    reactRequirements: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  }
};
