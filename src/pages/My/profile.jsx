import React from "react";
import ReactDOM from 'react-dom';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Button,
  Modal,
  Toast
} from "antd-mobile";
import "./index.scss";

const userController = require("@apis/controller")("user");
const Item = List.Item;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userVo: {},
      nickname: "",
      pic: '',
    };
    this.submit = this.submit.bind(this);
    this.imgSel = this.imgSel.bind(this);
  }

  componentDidMount() {
    userController("myprofile").then(({ code, data, msg }) => {
      if (code === 0 && data.userVo) {
        this.setState({
          userVo: data.userVo,
          nickname: data.userVo.nickname,
          pic: data.userVo.icon || 'http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png',
        });
      } else {
        Toast.info(msg);
      }
    });
  }

  submit() {
    var form = new FormData();
    form.append("image");
    userController(
      "updateUser",
      {
        nickname: this.state.nickname,
        sex: 1,
        signature: "23"
      },
      "post"
    ).then(({ code, msg }) => {
      if (code === 0) {
        Toast.info("更新成功");
      } else {
        Toast.info(msg);
      }
    });
  }

  imgSel(e) {
    var img = new Image(); //构造JS的Image对象
    let self = this;
    img.onload = () => {
      var form = new FormData();
      form.append("image");
    };
    var reader = new FileReader();
    reader.onload = evt => {
      this.setState({pic: evt.target.result})
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  render() {
    const { userVo } = this.state;
    return (
      <div className="myProfile">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          个人资料
        </NavBar>
        <div>
          <div className="profile-header">
            <img
              onClick={() => this.refs.upload.click()}
              src={this.state.pic}
              alt=""
              ref="pic"
              className="profile-img"
            />
            <div>点击修改头像</div>
            <input
              type="file"
              id="img"
              name="image"
              accept="image/*"
              ref="upload"
              style={{ width: 0, height: 0 }}
              onChange={this.imgSel}
            />
          </div>
          <List>
            <InputItem
              placeholder=""
              value={this.state.nickname}
              onChange={v => {
                this.setState({ nickname: v });
              }}
            >
              昵称
            </InputItem>
            <InputItem value={userVo.uid}>ID</InputItem>
            <InputItem value={userVo.uniqueId}>账号</InputItem>
            <Item extra={"extra content"}>二维码</Item>
          </List>
          <br />
          <Button onClick={this.submit}>保存</Button>
        </div>
      </div>
    );
  }
}
