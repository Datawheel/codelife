import axios from "axios";
import React, {Component} from "react";
import {connect} from "react-redux";
import {translate} from "react-i18next";
import Loading from "components/Loading";
import {Button} from "@blueprintjs/core";

import "./LevelEditor.css";

class LevelEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const {data} = this.props;
    this.setState({data});   
  }

  componentDidUpdate() {
    if (this.props.data.id !== this.state.data.id) {
      this.setState({data: this.props.data});
    }
  }

  changeField(field, e) {
    const {data} = this.state;
    data[field] = e.target.value;
    this.setState({data});
  }

  saveContent() {
    const {data} = this.state;
    if (this.props.reportSave) this.props.reportSave(data);
    axios.post("/api/builder/minilessons/save", data).then(resp => {
      resp.status === 200 ? console.log("saved") : console.log("error");
    });
  }

  render() {

    const {data} = this.state;

    if (!data) return <Loading />;
    
    return (
      <div id="level-editor">
        <label className="pt-label">
          id
          <span className="pt-text-muted"> (unique)</span>
          <input className="pt-input" onChange={this.changeField.bind(this, "id")} type="text" placeholder="Enter a unique level id e.g. level-1" dir="auto" value={data.id} />
        </label>
        <div className="input-block">
          <label className="pt-label">
            Name
            <input className="pt-input" onChange={this.changeField.bind(this, "name")} type="text" placeholder="Enter the name of this Island" dir="auto" value={data.name}/>
          </label>
          <label className="pt-label">
            pt Name
            <input className="pt-input" onChange={this.changeField.bind(this, "pt_name")} type="text" placeholder="Enter the name of this Island" dir="auto" value={data.pt_name}/>
          </label>
        </div>
        <div className="input-block">
          <label className="pt-label">
            Description
            <input className="pt-input" onChange={this.changeField.bind(this, "description")} type="text" placeholder="Describe this island in a few words" dir="auto" value={data.description} />
          </label>
          <label className="pt-label">
            pt Description
            <input className="pt-input" onChange={this.changeField.bind(this, "pt_description")} type="text" placeholder="Describe this island in a few words" dir="auto" value={data.pt_description} />
          </label>
        </div>
        <Button type="button" onClick={this.saveContent.bind(this)} className="pt-button pt-large pt-intent-success">Save</Button>
      </div>
    );
  }
}

LevelEditor = connect(state => ({
  auth: state.auth
}))(LevelEditor);
LevelEditor = translate()(LevelEditor);
export default LevelEditor;