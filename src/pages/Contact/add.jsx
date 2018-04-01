import React from "react";
import { NavBar, Icon, List, Button, SearchBar, Modal, Toast } from "antd-mobile";
import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import "./index.scss";
import ContactsScreenRedux from "@/redux/ContactsScreenRedux";

const userController = require("@apis/controller")("user");
const Item = List.Item;

class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchList: [],
      inviteCode: "",
      error: "  "
    };
    this.submit = this.submit.bind(this);
  }


  componentDidMount() {
    userController("myprofile").then(({ data }) => {
      if (data.userVo) {
        this.setState({
          inviteCode: data.userVo.inviteCode
        });
      }
    });
  }

  submit(v) {
    userController("searchUser", { content: v }).then(res => {
      if (res.code !== 0 || !res.data || !res.data.userVo) {
        this.setState({ error: res.msg });
      } else {
        this.setState({
          searchList: Array.isArray(res.data.userVo) ? res.data.userVo : [res.data.userVo],
          error: '',
        })
      }
    });
  }

  apply(id){
    return () => {
      userController('applyAddFriend', {otherId: id, content: '你好啊'}, 'post').then(res => {
        if(res.code === 1) {
          Toast.info(res.msg);
        } 
      })
    }
  }


  render() {
    const { applyList } = this.props.contacts;
    return (
      <div id="add">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          添加朋友
        </NavBar>
        <SearchBar placeholder="ID" onSubmit={this.submit} />
        
        {!this.state.error ? (
          <List>
            {this.state.searchList.map(item => (
              <Item
                key={item.uniqueId}
                extra={ item.friend ? '已添加' :
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={this.apply(item.uniqueId)}
                  >
                    添加
                  </Button>
                }
                multipleLine
                thumb={
                  item.icon ||
                  "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
                }
              >
                {item.nickname}
              </Item>
            ))}
          </List>
        ) : (
          <p className="user-not-found">{this.state.error}</p>
        )}

        <p className="inviteCode">我的ID: {this.state.inviteCode}</p>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ contacts }, props) => ({
      contacts
    }),
    dispatch => ({
      applyPass: id => {
        dispatch(ContactsScreenRedux.applyPass(id));
      }
    })
  )(AddContact)
);
