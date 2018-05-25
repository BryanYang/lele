import React from "react";
import { List, NavBar, Icon, Tabs } from "antd-mobile";
import { connect } from "react-redux";
import LayoutActions from "@/redux/LayoutRedux";
import "./log.scss";

const Item = List.Item;
const Brief = Item.Brief;
const userController = require("@apis/controller")("user");

const tabs = [
  { title: "登记记录" },
  { title: "保险箱存取" },
  { title: "密码修改" },
  { title: "转分给他人" }
];

class Com extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // type: 1,
      data: [],
      noMore: false,
    };
    this.type = 1; // 类型 1 登陆 2 保险箱存取 3 密码修改 4 转分给他人
    this.page = 1;
    this.tabChange = this.tabChange.bind(this);
    this.more = this.more.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.props.hiddenTab();
  }

  componentWillUnmount(){
    this.props.showTab();
  }

  tabChange(tab, i) {
    this.type = i + 1;
    this.page = 1;
    this.setState({
      noMore: false,
      data: [],
    }, () => {
      this.loadData();
    })
    
  }

  loadData() {
    const { type, page } = this;
    userController("operationRecord", { type, page }).then(res => {
      if (res.code === 0 && res.data && res.data.userOperationRecords) {
        this.setState({
          data: [...this.state.data, ...res.data.userOperationRecords],
          noMore: !res.ismore,
        });
      }
      console.log(res);
    });
  }

  more() {
    this.page = this.page + 1;
    this.loadData();
  }

  render() {
    return (
      <div className="my-log">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.push("/my");
          }}
        >
          操作记录
        </NavBar>
        <div style={{ height: "100%" }}>
          <Tabs
            tabBarActiveTextColor="#e73838"
            tabBarUnderlineStyle={{ borderColor: "#e73838" }}
            tabs={tabs}
            onChange={this.tabChange}
          >
            <div>
              <List>
                {this.state.data.map(item => (
                  <Item
                    key={item.id}
                    multipleLine
                    extra={
                      new Date(item.date).toLocaleDateString() +
                      " " +
                      new Date(item.date).toLocaleTimeString()
                    }
                  >
                    {item.opt} <Brief>设备 {item.phoneModel}</Brief>
                  </Item>
                ))}
                {
                  (this.state.data.length && !this.state.noMore) ? <div className="more" onClick={this.more}>查看更多</div> : ''
                }
                {
                  this.state.data.length === 0 ? <div className="no-record">暂无任何记录</div> : ''
                }
                
              </List>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(({}) => ({}), dispatch => ({
  hiddenTab: () => {
    dispatch(LayoutActions.hiddenTab());
  },
  showTab: () => {
    dispatch(LayoutActions.showTab());
  }

}))(Com);
