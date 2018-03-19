import React, {Component} from "react";
import {translate} from "react-i18next";
import {Link} from "react-router";
import {connect} from "react-redux";
import Browser from "components/Browser";
import AuthForm from "components/AuthForm";
import "./Nav.css";

import {Popover, PopoverInteractionKind, Position, Dialog} from "@blueprintjs/core";

// Nav Component
// Contains a list of links in Footer format, inserted at the bottom of each page

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBrowser: false,
      isLoginOpen: false
    };
  }

  /*
  This progress reloader is not robust. Ideally, userprogress should be loaded once ever, live in redux state,
  and update each time the user beats a level in parallel with updating the underlying database. However, to
  avoid a refactor, the following code manually reaches into the Browser component and reloads userprogress
  on each open/close of the panel.  TODO: revisit this
  */
  toggleBrowser() {
    this.setState({showBrowser: !this.state.showBrowser});
    if (this.browser) this.browser.getWrappedInstance().getWrappedInstance().reloadProgress();
  }

  reportClick() {
    this.setState({showBrowser: false});
  }

  toggleLoginOpen() {
    this.setState({isLoginOpen: !this.state.isLoginOpen});
  }

  render() {

    const {auth, logo, t, linkObj} = this.props;
    const {isLoginOpen} = this.state;

    return (
      <div className="nav" id="nav">

        <Link className={logo ? "logo" : "logo is-hidden"} to={"/"}>
          <div className="tag">Beta</div>
          <img className="text" src="/logo/logo-sm.png" alt="Codelife" />
        </Link>
        { auth.user
          ? <div className="links">
            <Link className="link map-link" to="/island">
              <span className="link-icon pt-icon-standard pt-icon-map" />
              <span className="link-text">{ t("Map") }</span>
            </Link>
            <Popover
              interactionKind={PopoverInteractionKind.CLICK}
              className="browser"
              popoverClassName="pt-popover-content-sizing browser-popover"
              position={Position.BOTTOM}
            >
              <button className="browser-toggle u-unbutton" onClick={this.toggleBrowser.bind(this)} >
                <span className="toggle-icon pt-icon-standard pt-icon-chevron-down"></span>
              </button>
              <div className="browser-list" id="browser">
                <Browser ref={b => this.browser = b} linkObj={linkObj} reportClick={this.reportClick.bind(this)}/>
              </div>
            </Popover>
            <Link className="link" to={`/projects/${auth.user.username}`}>
              <span className="link-icon pt-icon-standard pt-icon-book" />
              <span className="link-text">{ t("Projects") }</span>
            </Link>
            <Popover
              interactionKind={PopoverInteractionKind.HOVER}
              popoverClassName="pt-popover-content-sizing user-popover"
              position={Position.BOTTOM}
            >
              <Link className="link" to={ `/profile/${ auth.user.username }` }>
                <span className="link-icon pt-icon-standard pt-icon-user" />
                <span className="link-text">{ auth.user.username }</span>
              </Link>
              <div>
                <Link className="pt-button" to={ `/profile/${ auth.user.username }` }>
                  { t("Profile") }
                </Link>
                { auth.user.role > 0 ? <Link className="pt-button" to="/admin">
                  { t("Admin") }
                </Link> : null }
                <a className="pt-button" href="/auth/logout">
                  { t("Logout") }
                </a>
              </div>
            </Popover>
          </div>
          : <div className="links">
            <button className="link u-unbutton" onClick={this.toggleLoginOpen.bind(this)}>
              <span className="link-icon pt-icon-standard pt-icon-log-in" />
              <span className="link-text">{ t("LogIn.Log_in") }</span>
            </button>
            <Link className="link" to="/about">
              <span className="link-icon pt-icon-standard pt-icon-help" />
              <span className="link-text">{ t("About") }</span>
            </Link>
          </div> }
        <Dialog
          className="form-container"
          iconName="inbox"
          isOpen={isLoginOpen}
          onClose={this.toggleLoginOpen.bind(this)}
          title="Dialog header"
        >
          <AuthForm initialMode="login"/>
        </Dialog>
      </div>
    );
  }
}

Nav.defaultProps = {
  logo: true
};

Nav = connect(state => ({
  auth: state.auth
}))(Nav);
Nav = translate()(Nav);
export default Nav;
