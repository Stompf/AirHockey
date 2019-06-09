import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Start } from './views';

// const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
    <BrowserRouter>
        <Start />
    </BrowserRouter>,
    document.getElementById('app')
);
