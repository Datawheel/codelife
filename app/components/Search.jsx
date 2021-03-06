import axios from "axios";
import React, {Component} from "react";
import {translate} from "react-i18next";
import {Link} from "react-router";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import "./Search.css";

/**
 * The Search component is embedded in Nav and is used to search users and projects. It utilizes postgres trigrams serverside (see readme)
 */

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchid: 0,
      results: {
        users: [],
        projects: []
      },
      selectedIndex: null
    };
  }

  componentDidMount() {
    // document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  /**
   * On keystroke, hit the search API endpoint
   */
  handleChange(e) {
    const query = e.target.value;
    const searchid = this.state.searchid + 1;
    // Only search if query string has reached a meaningful length
    if (query.length > 2) {
      this.setState({query, searchid}, this.search.bind(this));
    }
    else {
      this.setState({query, results: {users: [], projects: []}});
    }
  }

  /**
   * Search is not a top-level component in routes.jsx, so it doesn't have access to the Router object that would indicate
   * what page the user is on. This makes it difficult to collapse the search results if the user clicks a link outside the
   * results. To get around this, a linkObj is passed down from App to Nav to here, and search is collapsed on URL change.
   */
  componentDidUpdate(prevProps) {
    if (this.props.linkObj !== prevProps.linkObj) {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.setState({selectedIndex: null, query: "", results: {users: [], projects: []}});
  }

  /**
   * onKeyDown is meant to capture inputs - but the arrow up/down aren't currently functional (user can use tabs and
   * Enter key to go through links however). This UX could be improved.
   */
  onKeyDown(e) {
    const {selectedIndex, results} = this.state;
    const allResults = results.users.concat(results.projects);
    const {browserHistory} = this.context;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      if (selectedIndex === null) {
        if (e.key === "ArrowDown") {
          this.setState({selectedIndex: 0});
        }
      }
      else {
        if (e.key === "ArrowDown" && selectedIndex < allResults.length) {
          this.setState({selectedIndex: selectedIndex + 1});
        }
        else if (e.key === "ArrowUp" && selectedIndex > 0) {
          this.setState({selectedIndex: selectedIndex - 1});
        }
        else if (e.key === "Enter") {
          const selectedItem = allResults[selectedIndex];
          if (selectedItem && selectedItem.type === "user") browserHistory.push(`/profile/${selectedItem.username}`);
          if (selectedItem && selectedItem.type === "project") browserHistory.push(`/projects/${selectedItem.user.username}/${selectedItem.slug ? selectedItem.slug : selectedItem.name}`);
          this.clearSearch();
        }
      }
    }
    else if (e.key === "Escape") {
      this.clearSearch();
    }
  }

  /**
   * Send search query to API endpoint
   */
  search() {
    const {query, searchid} = this.state;
    axios.get(`/api/search/?query=${query}&searchid=${searchid}`).then(resp => {
      if (resp.status === 200) {
        // Fix a bug where results were coming in out of order by sending an incrementing counter with the payload
        if (Number(resp.data.searchid) >= this.state.searchid) {
          this.setState({results: resp.data});
        }
      }
      else {
        console.log("error");
      }
    });
  }

  render() {

    const {t, scope} = this.props;
    const {results, selectedIndex, query} = this.state;
    const inputID = `${scope}-search-input`;

    const allResults = results.users.concat(results.projects).map(r => {
      r.selected = false;
      return r;
    });

    const selectedItem = allResults && selectedIndex !== null ? allResults[selectedIndex] : null;
    if (selectedItem) selectedItem.selected = true;

    const userList = results.users.map(r =>
      <li key={r.id} className="search-results-item user-result">
        <Link className={`search-results-link ${r.selected ? "search-selected" : ""}`} to={`/profile/${r.username}`} onClick={this.clearSearch.bind(this)}>
          <span className="search-results-text primary-search-results-text font-sm">{r.username}</span>
          {r.name ? <span className="search-results-text secondary-search-results-text font-xs">{r.name}</span> : "" }
        </Link>
      </li>
    );
    const projectList = results.projects.filter(r => r.user).map(r =>
      <li key={r.id} className="search-results-item project-result">
        <Link className={`search-results-link ${r.selected ? "search-selected" : ""}`} to={`/projects/${r.user.username}/${r.slug ? r.slug : r.name}`} onClick={this.clearSearch.bind(this)}>
          <span className="search-results-text primary-search-results-text font-sm">{r.name}</span>
          <span className="search-results-text secondary-search-results-text font-xs">
            {t("by")} {r.user.username}
          </span>
        </Link>
      </li>
    );

    return (
      <div className="search-container" role="search">

        {/* icon as label */}
        <label className="search-label" htmlFor={inputID}>
          <span className="search-label-icon pt-icon pt-icon-search" />
          <span className="u-visually-hidden">{t("Search.Site")}</span>
        </label>

        {/* text input */}
        <input
          id={inputID}
          className="search-input font-sm"
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          value={query}
          placeholder={t("Search.Site")} />

        {/* text input */}
        <div
          className={query.length > 0 ? "search-results-outer" : "search-results-outer is-hidden"}
          aria-hidden={query.length ? false : true}
        >

          {/* Message: keep typing */}
          <p className={query.length <= 2 ? "heading search-results-message font-lg u-margin-bottom-off u-text-center" : "heading search-results-message is-hidden"}>{t("Search.KeepTyping")}</p>

          {/* Message: no results */}
          <p className={query.length > 2 && allResults.length === 0 ? "heading search-results-message font-lg u-margin-bottom-off u-text-center" : "heading search-results-message is-hidden"}>{t("Search.NoResults")}</p>

          {/* users */}
          <div className={query.length > 2 && userList.length !== 0 ? "search-results-inner" : "search-results-inner is-hidden"}>
            <p className="heading search-results-heading font-md">
              <span className="search-results-heading-icon pt-icon pt-icon-people" />&nbsp;{t("Search.UsersHeading")}
            </p>
            <ul className="search-results-list">
              {userList}
            </ul>
          </div>

          {/* projects */}
          <div className={query.length > 2 && projectList.length !== 0 ? "search-results-inner" : "search-results-inner is-hidden"}>
            <p className="heading search-results-heading font-md">
              <span className="search-results-heading-icon pt-icon pt-icon-applications" />&nbsp;{t("Search.ProjectsHeading")}
            </p>
            <ul className="search-results-list">
              {projectList}
            </ul>
          </div>

          {/* close button */}
          <button
            className="search-reset-button pt-dialog-close-button pt-icon-small-cross"
            onClick={this.clearSearch.bind(this)}
            aria-label="Close"
            tabIndex={query.length ? 0 : -1}
          />
        </div>
      </div>
    );
  }
}

Search.contextTypes = {
  browserHistory: PropTypes.object
};

Search = connect(state => ({
  auth: state.auth
}))(Search);
Search = translate(undefined, {withRef: true})(Search);
export default Search;
