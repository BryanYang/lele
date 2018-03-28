import React from 'react';
import { SearchBar, List } from 'antd-mobile';

const Item = List.Item;

class Contact extends React.Component {
  
  render(){
    return <div>
    <SearchBar placeholder="Search" />
    <Item
      thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
      arrow="horizontal"
      onClick={() => {}}
    >name</Item>
    </div>
  }
}