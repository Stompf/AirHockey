import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Start } from './views';

const history = createBrowserHistory();

ReactDOM.render(<Start history={history} />, document.getElementById('app'));
