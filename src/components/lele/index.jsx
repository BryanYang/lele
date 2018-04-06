import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon, Dropdown } from "antd";
import { Grid } from "antd-mobile";

import "./index.scss";

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const DATA = ["闲", "和", "庄", "闲对", "庄对", "双对", "三宝"].map(t => ({
  text: t
}));
const COLORS = {
  闲: "#008fe0",
  和: "#29ab91",
  庄: "#f15a4a",
  闲对: "#008fe0",
  庄对: "#f15a4a",
  双对: "#fc992c",
  三宝: "#3bb1f3"
};

const colors = item => {
  return COLORS[item] || "black";
};

class Lele extends React.Component {
  state = {
    tabPosition: "bottom",
    size: "",
    emojiPadding: 5,
    emojiWidth: 25,
    lineNum: 10
  };

  renderLeleMenu() {
    return (
      <Grid
        data={DATA}
        onClick={this.props.onSelect}
        square={false}
        renderItem={item => (
          <div style={{ color: colors(item.text) }} className="game-item">
            {item.text}
          </div>
        )}
      />
    );
  }

  handleChange = tabPosition => {
    // this.setState({ tabPosition })
  };

  render() {
    const menu = this.renderLeleMenu();
    return (
      <div className="ib">
        <Dropdown overlay={menu} trigger={["click"]}>
          <a className="ant-dropdown-link" href="#">
            <span style={{ color: "rgba(0, 0, 0, 0.65)" }} className="icon-tou">
              投
            </span>
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default Lele;
