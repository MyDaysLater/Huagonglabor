import React, { Component } from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Layout, message, Spin } from "antd";
import styles from "./AppLayout.module.less";
import SiderMenu from "./SiderMenu";
import AppRoutes from "./AppRoutes";
import AppHeader from "./components/AppHeader";
import corpService from "./services/corp";
import Notfound from "./pages/NotFound";
// import logo from "./images/logo2.svg";
import logo from "./images/huagong_2.png";
import { appName } from "./config";
const { Content, Sider } = Layout;
@inject("app")
@inject("staff")
@inject("user")
@observer
class AppLayout extends Component {
  state = {
    corpid: "",
    hasSelectedCorp: false,
  };
  constructor(props) {
    super(props);
    const { corpid } = props.match.params;
    this.state.hasSelectedCorp = props.app.currentCorp;
    if (corpid) {
      this.state.corpid = corpid;
      !props.app.currentCorp && props.app.setCurrentCorp({ id: corpid });
      const { userInfo } = props.user;
      props.staff.staffCorpRole({
        "filter[corp_id]": corpid,
        "filter[user_id]": userInfo.id,
      });
    }
  }
  async componentDidMount() {
    const { corpid, hasSelectedCorp } = this.state;
    if (corpid && !hasSelectedCorp) {
      const { errCode, data } = await corpService.detail(corpid);
      if (errCode) {
        message.error(data.message || "获取企业信息失败");
        return;
      }
      this.props.app.setCurrentCorp(data);
    }
  }
  render() {
    const { siderCollapse, currentCorp = {} } = this.props.app;
    const { role = {} } = this.props.staff.staffCorpRoleResult;
    // console.log(currentCorp, corpRole)
    // console.log(this.props)
    return (
      <Layout className={styles.app}>
        {currentCorp.name && role && (
          <Sider collapsed={siderCollapse}>
            {!siderCollapse ? <div className={styles.siderLogo_}>
              <img className={styles.logo} src={logo} alt="" />
              <span style={{ marginLeft: '10px', fontSize: '16px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>华工劳务通</span>
              {/* <span style={{ color: 'rgb(255,255,255)' }} className={styles.corpName}>{appName}</span> */}
            </div> : <div className={styles.siderLogo_}>
                <img className={styles.logo} src={logo} alt="" />
              </div>}
            <SiderMenu />
          </Sider>
        )
        }
        <Layout>
          <AppHeader
            trigger={currentCorp.name ? true : false}
            title={
              <h3 className={styles.title}>
                {currentCorp.name}
                {/* <Link className={styles.switchBtn} to="/corps">
                  切换企业
                </Link> */}
              </h3>
            }
          />
          <Content>
            <Spin
              style={{ marginTop: 100 }}
              spinning={
                !currentCorp.httpStatus && !currentCorp.name && !role
              }
            >
              {currentCorp.httpStatus === 404 && <Notfound />}
              {currentCorp.name && <AppRoutes />}
            </Spin>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default AppLayout;
