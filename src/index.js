import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import './index.scss';
import Routes from '../src/components/Routes';
import { store } from "@/redux"
import { BrowserRouter, Route, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('root'),
  )
}

render(Routes)

registerServiceWorker();

