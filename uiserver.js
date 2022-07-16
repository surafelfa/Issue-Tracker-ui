/* eslint linebreak-style: ["error", "windows"] */

require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('http-proxy-middleware');


const app = express();

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (process.env.NODE_ENV !== 'production')) {
  console.log('Adding dev middleware, enabling HMR');

  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config');
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

/*
express.static generate middleware function that return static file.
use():- mounts the middleware function on the application
*/
app.use(express.static('public'));

const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://localhost:3000';

// any request to /graphql is routed to the API server.
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
  app.use('/auth', proxy({ target: apiProxyTarget }));
}

if (!process.env.UI_AUTH_ENDPOINT) {
  process.env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
}

app.get('/env.js', (req, res) => {
  // let the UI code access this new variable is shown in Listing
  const env = {
    UI_API_ENDPOINT: process.env.UI_API_ENDPOINT || 'http://localhost:8000/graphql',
    UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT || 'http://localhost:8000/auth',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  };
  // {"UI_API_ENDPOINT":"http://localhost:3000/graphql"}
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const port = process.env.PORT || 8000;


app.listen(port, () => {
  console.log(`UI started on port ${port}`);
});
