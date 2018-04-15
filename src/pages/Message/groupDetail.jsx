/**
 * 群聊详情页面
 */
import React from "react";
import { NavBar, Icon, Grid, List, Button, Modal, Toast } from "antd-mobile";
import _ from "lodash";

const userController = require("@apis/controller")("user");
const DefaultImg =
  "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png";

class GroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.groupid = this.props.match.params.id;
    this.state = {
      groupVo: {
        userVos: []
      }
    };
    this.quit = this.quit.bind(this);
  }

  componentDidMount() {
    userController("groupDetail", { groupid: this.groupid }).then(res => {
      this.setState({
        groupVo: _.get(res, "data.groupVo")
      });
    });
  }

  confirm() {
    Modal.alert('请确认', '你确定要退出群聊吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.quit() },
    ])
  }

  quit(){
    userController('exitGroup', {groupid: this.groupid}, 'post').then(res => {
      if(res.code === 0){
        this.props.history.replace('/message');
      } else {
        Toast.fail(res.msg);
      }
    })
  }

  render() {
    const { userVos=[] } = this.state.groupVo;
    const userMe = userVos.find(u => u.isme);
    const data = userVos.map(user => ({
      icon: user.icon || DefaultImg,
      text: user.groupNickname
    }));
    data.push({ icon: "", text: "添加" });
    return (
      <div id="detail">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          群聊详情({userVos.length})
        </NavBar>
        <Grid data={data} columnNum={5} activeStyle={false} hasLine={false} />
        <br />
        <List className="my-list">
          <List.Item extra={this.state.groupVo.groupname}>群聊名称</List.Item>
          <List.Item extra={userMe ? userMe.groupNickname : ''}>我在本群昵称</List.Item>
        </List>

        <Button type="warning" className="btn-quit" onClick={this.confirm}>删除并退出</Button>
      </div>
    );
  }
}

export default GroupDetail;
