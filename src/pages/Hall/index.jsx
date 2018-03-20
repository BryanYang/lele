import React from 'react';

import { List, NavBar } from 'antd-mobile';
import { Link } from 'react-router-dom';
import './index.scss';

const data = [
  {img: '', link: '/game'},
  {img: '', link: '/game'},
  {img: '', link: '/game'},
]

export default class Hall extends React.PureComponent {
  render(){
    return <div>
      <NavBar
        mode="dark"
      >大厅</NavBar>
      <List className="my-list">
        {data.map(d => <Link to={d.link}>
          <div className="hall-container">
            <img className="hall-img" alt="" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1280747493,1814733925&fm=27&gp=0.jpg"/>
          </div>
        </Link>)}
      </List>
    </div>
  }
}