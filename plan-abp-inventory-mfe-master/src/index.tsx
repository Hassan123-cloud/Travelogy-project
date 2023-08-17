/*
 * ===============================================================================================================
 *                                Copyright 2020, Blue Yonder Group, Inc.
 *                                           All Rights Reserved
 *
 *                               THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF
 *                                          BLUE YONDER GROUP, INC.
 *
 *
 *                         The copyright notice above does not evidence any actual
 *                                 or intended publication of such source code.
 *
 * ===============================================================================================================
 */

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';
import './index.css';
import App from './App';
import Dev from './components/Sandbox';
import * as serviceWorker from './serviceWorker';

const Loader = () => (
  <div id={'app-loading'}>
    <div>loading...</div>
  </div>
);

if (process.env.REACT_APP_AUTH === 'NO_AUTH') {
  ReactDOM.render(
    <Router>
      <Suspense fallback={<Loader />}>
        <Dev />
      </Suspense>
    </Router>,
    document.getElementById('root'),
  );
} else if (window.parent !== window) {
  ReactDOM.render(
    <Router>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Router>,
    document.getElementById('root'),
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
