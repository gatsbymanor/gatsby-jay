const path = require('path');

exports.createPages = async ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const indexTemplate = path.resolve(__dirname, `templates`, `index.js`);
  createPage({
    path: '/',
    component: indexTemplate,
  });

  const errorTemplate = path.resolve(__dirname, `templates`, `404.js`);
  createPage({
    path: '/404',
    component: errorTemplate,
  });

  const pageTemplate = path.resolve(__dirname, `templates`, `page-2.js`);
  createPage({
    path: '/page-2',
    component: pageTemplate,
  });

};
