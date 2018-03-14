import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Routes from '../src/components/Routes';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const render = (Component) => {
  ReactDOM.render(<Component />,
    document.getElementById('root'),
  )
}

render(Routes)

registerServiceWorker();

