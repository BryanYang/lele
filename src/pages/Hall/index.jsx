import React from 'react';

import { List, NavBar, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.scss';

export default class Hall extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    axios.get('/app/v1/gameLobby').then(({data: res}) => {
      if(res.code === 0 && res.data){
        this.setState({
          data: res.data.gameLobbyVos
        })
      } else {
        Toast.fail(res.msg, 1);
      }
    })
  }

  render(){
    return <div>
      <NavBar
        mode="dark"
      >大厅</NavBar>
      <List className="my-list">
        {this.state.data.map(d => <Link to={'/game/' + d.id + '?groupId=' + d.groupId} key={d.id}>
          <div className="hall-container">
            <img className="hall-img" alt="" src={d.image}/>
          </div>
        </Link>)}
      </List>
    </div>
  }
}