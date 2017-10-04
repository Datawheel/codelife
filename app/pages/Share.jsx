import React, {Component} from "react";
import {translate} from "react-i18next";
import axios from "axios";
import ReportBox from "components/ReportBox";
import {Position, Popover, PopoverInteractionKind, Intent, Button} from "@blueprintjs/core";
import "./Share.css";

import Loading from "components/Loading";

class Share extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: null,
      user: null
    };
  }

  renderPage() {
    if (this.refs.rc) {
      const doc = this.refs.rc.contentWindow.document;
      doc.open();
      doc.write(this.state.content.studentcontent);
      doc.close();
      const {uid} = this.state.content;
      axios.get(`/api/user/${uid}/`).then(resp => {
        this.setState({user: resp.data});
      });
    }
  }

  componentDidMount() {
    const {username, filename} = this.props.params;
    let type = "";
    if (this.props.location.pathname.includes("/codeBlocks/")) type = "codeBlock";
    if (this.props.location.pathname.includes("/projects/")) type = "project";
    if (type === "codeBlock") {
      const cbget = axios.get(`/api/codeBlocks/byUsernameAndFilename?username=${username}&filename=${filename}`);
      const rget = axios.get("/api/reports");

      Promise.all([cbget, rget]).then(resp => {
        const content = resp[0].data[0];
        const reports = resp[1].data;
        this.setState({content, reports}, this.renderPage.bind(this));
      });
    }
    if (type === "project") {
      const pget = axios.get(`/api/projects/byUsernameAndFilename?username=${username}&filename=${filename}`);
      const rget = axios.get("/api/reports");

      Promise.all([pget, rget]).then(resp => {
        const content = resp[0].data[0];
        const reports = resp[1].data;
        this.setState({content, reports}, this.renderPage.bind(this));
      });
    }
  }

  render() {
    const {content, reports, user} = this.state;

    if (!content) return <Loading />;

    const {t} = this.props;
    const {name, id} = content;

    let contentType = "";
    if (this.props.location.pathname.includes("/codeBlocks/")) contentType = "codeblock";
    if (this.props.location.pathname.includes("/projects/")) contentType = "project";

    const reported = reports.find(r => r.type === contentType && r.report_id === id); 

    return (
      <div id="share">
        <iframe id="iframe" ref="rc" />
        <div id="tag">
          <div className="info">
            <span className="pt-icon-standard pt-icon-code"></span>
            { name }{ user ? ` ${ t("by") } ` : "" }{ user ? <a className="user-link" href={ `/profile/${ user.username }` }>{ user.name || user.username }</a> : null }
          </div>
          <div className="logo">
            { t("Hosted by") } <a href="/"><img src="/logo/logo-sm.png" /></a>
          </div>
          <Popover
            interactionKind={PopoverInteractionKind.CLICK}
            popoverClassName="pt-popover-content-sizing"
            position={Position.TOP_RIGHT}
          >
            <Button
              intent={reported ? "" : Intent.DANGER}
              iconName="flag"
              text={reported ? "Flagged" : "Flag"}
            />
            <div>
             <ReportBox reportid={id} contentType={contentType}/>
            </div>
          </Popover>

          
        </div>
      </div>
    );
  }
}

export default translate()(Share);
