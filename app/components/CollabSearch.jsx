import axios from "axios";
import React, {Component} from "react";
import {translate} from "react-i18next";
import {Card, Icon} from "@blueprintjs/core";
import {connect} from "react-redux";
import "./CollabSearch.css";

class CollabSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      users: [],
      geos: [],
      schools: [],
      MAX_COLLABS: 5
    };
  }

  handleChange(e) {
    const query = e.target.value;
    if (query.length > 2) {
      this.setState({query});
      this.search();
    }
    else {
      this.setState({query, users: []});
    }
  }

  clearSearch() {
    this.setState({query: "", users: []});
  }

  search() {
    const {query} = this.state;
    axios.get(`/api/searchusers/?query=${query}`).then(resp => {
      if (resp.status === 200) {
        this.setState({users: resp.data});
      }
      else {
        console.log("error");
      }
    });
  }

  addCollaborator(searchResult) {
    const {currentProject} = this.props;
    const pid = currentProject.id;
    const uid = searchResult.uid;
    const atMax = currentProject.collaborators.length >= this.state.MAX_COLLABS;
    if (uid && pid && !atMax) {
      const payload = {uid, pid};
      axios.post("/api/projects/addcollab", payload).then(resp => {
        if (resp.status === 200) {
          currentProject.collaborators = currentProject.collaborators.concat(searchResult);
          this.setState({currentProject});
        }
        else {
          console.log("error");
        }
      });
    }
  }

  removeCollaborator(uid) {
    const {currentProject} = this.props;
    const pid = currentProject.id;
    if (uid && pid) {
      const payload = {uid, pid};
      axios.post("/api/projects/removecollab", payload).then(resp => {
        if (resp.status === 200) {
          currentProject.collaborators = currentProject.collaborators.filter(c => c.uid !== uid);
          this.setState({currentProject});
        }
        else {
          console.log("error");
        }
      });
    }
  }

  render() {

    const {t, currentProject} = this.props;
    const {users, query, filterLoc, filterSchool} = this.state;
    const collabs = currentProject.collaborators;
    const atMax = collabs.length >= this.state.MAX_COLLABS;

    // do not include a current collaborator in the search results
    let usersWithoutCollabs = users.filter(u => !collabs.map(c => c.uid).includes(u.uid));

    const locList = Array.from(new Set(usersWithoutCollabs
      .map(r => r.geo && r.geo.name ? r.geo.name : null)))
      .filter(loc => Boolean(loc))
      .map(loc => 
        <option key={loc} value={loc}>{loc}</option>
      );

    const schoolList = Array.from(new Set(usersWithoutCollabs
      .map(r => r.school && r.school.name ? r.school.name : null)))
      .filter(school => Boolean(school))
      .map(school => 
        <option key={school} value={school}>{school}</option>
      );

    if (filterLoc && filterLoc !== "default") {
      usersWithoutCollabs = usersWithoutCollabs.filter(u => u.geo && u.geo.name && u.geo.name === filterLoc);
    }

    if (filterSchool && filterSchool !== "default") {
      usersWithoutCollabs = usersWithoutCollabs.filter(u => u.school && u.school.name && u.school.name === filterSchool);
    }

    const userList = usersWithoutCollabs.map(r =>
      <li className="list-result" key={r.id}>
        <Card interactive={true} elevation={Card.ELEVATION_TWO}>
          <h5>{r.user.username}</h5><br/>
          {r.geo && r.geo.name ? <p><Icon iconName="map-marker" /> {r.geo.name}</p> : null}
          {r.school && r.school.name ? <p><Icon iconName="office" /> {r.school.name}</p> : null}
          <button onClick={this.addCollaborator.bind(this, r)}>Add</button>
        </Card>
      </li>
    );

    const collabList = collabs.map(r => 
      <li className="collab-result" key={r.id}>
        <Card interactive={true} elevation={Card.ELEVATION_TWO}>
          <h5>{r.user.username}</h5><br/>
          {r.geo && r.geo.name ? <p><Icon iconName="map-marker" /> {r.geo.name}</p> : null}
          {r.school && r.school.name ? <p><Icon iconName="office" /> {r.school.name}</p> : null}
          <button onClick={this.removeCollaborator.bind(this, r.uid)}>Remove</button>
        </Card>
      </li>
    );
    
    return (
      <div className="collab-container">
        <h3>{`${t("Collaborate on")} ${currentProject.name}`}</h3>
        <input
          onChange={this.handleChange.bind(this)}
          value={query}
          placeholder={t("Search.Users")} 
        />
        <div className="collab-selections">
          current collaborators
          <ul className="collab-list">
            {collabList}
          </ul>
        </div>
        <div className="pt-select">
          filter by loc
          <select value={this.state.filterLoc} onChange={e => this.setState({filterLoc: e.target.value})}>
            <option value="default">show all locations</option>
            {locList}
          </select>
        </div>
        <div className="pt-select">
          filter by school
          <select value={this.state.filterSchool} onChange={e => this.setState({filterSchool: e.target.value})}>
            <option value="default">show all schools</option>
            {schoolList}
          </select>
        </div>
        <div className="box-results">
          search results
          <ul className="list-results">
            {atMax ? <div>{t("at max")}</div> : userList}
          </ul>
        </div>
      </div>
    );
  }
}

CollabSearch = connect(state => ({
  auth: state.auth
}))(CollabSearch);
CollabSearch = translate(undefined, {withRef: true})(CollabSearch);
export default CollabSearch;
