import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export function renderPage(location) {
  return renderToString(React.createElement(StaticRouter, { location }, React.createElement(App)));
}
