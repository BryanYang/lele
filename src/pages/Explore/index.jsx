import React from 'react';
import ReactDOM from 'react-dom';
import { ListView, NavBar} from 'antd-mobile';
import { TabBar, Icon, InputItem } from 'antd-mobile';
import axios from 'axios';

import { Img, Svg } from '@components/Icon';
import Search from '@assets/svg/search.svg';
import { Link } from "react-router-dom";




import './index.scss';

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒1',
    origin: '图说城事'
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒2',
    origin: '图说城事'
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒3',
    origin: '图说城事'
  },
];

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];


function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {
        props.children
      }
    </div>
  );
}

export default class Explore extends React.Component {

  constructor(props) {
    super(props);
    const getRowData = (dataBlob, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
      search: false,
    };
    this.onSearch = this.onSearch.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    this.setState({isLoading: true});
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    axios.get('/app/v1/information').then(({ data: res }) => {
      this.setState({isLoading: false});
      console.log(res);
      if(res.code === 0){
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.data.informationVos),
          isLoading: false,
          height: hei,
        });
      }
    }) 
  }

  onEndReached(){

  }

  onSearch(){
    console.log(this.searchContent);
    this.tempDataSource = this.state.dataSource; // 缓存一下，取消的时候还要用。
    setTimeout(() => {
      this.setState({dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})});
    })
  }

  cancelSearch(){
    this.setState({
      dataSource: this.tempDataSource,
      search: false,
    })
  }

  searchChange(v){
    this.searchContent = v;
  }

  render(){
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} className="border-bt"/>
    );

    const row = (rowData, sectionID, rowID) => {
      const obj = rowData[rowID];
      const showAd = obj.type === 1;
      return (
        <div key={obj.id}>
        {
          showAd ? <Link to={`/article/${encodeURIComponent(obj.detailurl)}`} >
            <div className="ad">
              <div className="title">{obj.title}</div>
              <div className="img-container">
                <img className="img" alt="" src={obj.image} />
                <div className="ad-identification">广告</div>
              </div>
            </div></Link> : <div>
            <Link to={`/article/${encodeURIComponent(obj.detailurl)}`} className="section">
              <div className="img-container"><img src={obj.image} alt="" className="img"/></div>
              <div className="brief">
                <div className="desc">{obj.title}</div>
                <div className="origin">{obj.author}</div>
              </div>
            </Link>
          </div>
        }
        </div>
      );
    };

    return <div>
      {
        this.state.search ? <div className="search">
          <InputItem className="search-input" onChange={this.searchChange}>
            <Svg glyph="search" fill="white" onClick={this.onSearch}/> 
          </InputItem>
          <span className="cancel-search" onClick={this.cancelSearch}>取消</span>
        </div> : <NavBar
          mode="dark"
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={[
            <Svg glyph="search" fill="white" onClick={() => this.setState({search: true})}/>
          ]}
        ><span>发现</span></NavBar>
      }
      
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div className="explore-footer">
          {this.state.isLoading ? '加载中...' : '没有更多内容'}
        </div>)}
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
      </div>
  }
    
}