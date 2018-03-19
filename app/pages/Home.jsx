import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {translate} from "react-i18next";
import {Intent, Spinner} from "@blueprintjs/core";
import axios from "axios";
import CodeBlockCard from "components/CodeBlockCard";
import ProjectCard from "components/ProjectCard";
import AuthForm from "components/AuthForm";
import {Dialog} from "@blueprintjs/core";
import "./Home.css";

class Home extends Component {

  constructor() {
    super();
    this.state = {
      codeBlocks: false,
      current: false,
      progress: [],
      projects: false,
      isSignupOpen: false,
      formMode: "login"
    };
  }

  toggleSignupOpen(modeArg) {
    this.setState({formMode: modeArg, isSignupOpen: !this.state.isSignupOpen});
  }

  componentDidMount() {
    const {user} = this.props;
    if (user) {
      axios.get("/api/userprogress/mine")
        .then(resp => {
          const {current, progress} = resp.data;
          this.setState({current, progress});
        });
    }
    const codeBlocks = axios.get("/api/codeBlocks/featured");
    const projects = axios.get("/api/projects/featured");
    Promise.all([codeBlocks, projects])
      .then(resp => this.setState({
        codeBlocks: resp[0].data,
        projects: resp[1].data
      }));
  }

  render() {

    const {locale, t, islands} = this.props;
    const {codeBlocks, current, isSignupOpen, progress, projects} = this.state;

    const videos = {
      en: "3s2vPV-tRhI",
      pt: "9ImSvqDDQuc"
    };

    return (
      <div id="Home">
        <div id="island" className={ `island ${current ? current.theme : "island-jungle"}` }>
          <div className="island-image image">
            <div className="logo">
              <div className="tag">Beta</div>
              <img className="text" src="/logo/logo-shadow.png" />
            </div>
            { current
              ? <Link to={ `/island/${current.id}` } className={ `pt-button pt-intent-primary pt-large ${current.icon}` }>{ progress.length ? t("home.continue", {island: current.name}) : t("home.start", {island: current.name}) }</Link>
              : <h2 className="title">{ t("home.tagline") }</h2> }
            <iframe className="video" src={ `https://www.youtube-nocookie.com/embed/${ videos[locale] || videos.en }?rel=0` } frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
        <h3>sign up</h3>
        <button className="pt-button pt-button-standard" onClick={this.toggleSignupOpen.bind(this, "signup")}>get started</button>
        <button className="pt-button pt-button-standard" onClick={this.toggleSignupOpen.bind(this, "login")}>login</button>
        <Dialog
          className="form-container"
          iconName="inbox"
          isOpen={isSignupOpen}
          onClose={this.toggleSignupOpen.bind(this)}
          title="Dialog header"
        >
          <AuthForm initialMode={this.state.formMode}/>
        </Dialog>
        <h2>{ t("Featured Projects") }</h2>
        <div className="projects">
          { !projects ? <Spinner intent={Intent.PRIMARY}/> : projects.map(p => <ProjectCard key={p.id} project={p} />) }
        </div>
        <h2>{ t("Featured CodeBlocks") }</h2>
        <div className="codeBlocks">
          { !codeBlocks ? <Spinner intent={Intent.PRIMARY}/> : codeBlocks.map(c => {
            const {theme, icon} = islands.find(i => i.id === c.lid);
            return <CodeBlockCard key={c.id} codeBlock={c} theme={theme} icon={icon} />;
          }) }
        </div>
        <h2>{ t("What is CodeLife?") }</h2>
        <div className="aboutTxt">
          <p>{ t("splashP1") }</p>
          <p>{ t("splashP2") }</p>
          <p>{ t("splashP3") }</p>
          <p>{ t("splashP4") }</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.i18n.locale,
  user: state.auth.user,
  auth: state.auth,
  islands: state.islands
});

Home = connect(mapStateToProps)(Home);
export default translate()(Home);
