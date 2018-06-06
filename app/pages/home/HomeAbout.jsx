import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import "./HomeAbout.css";

class HomeAbout extends Component {

  render() {
    const {locale, t} = this.props;

    const videos = {
      en: "3s2vPV-tRhI",
      pt: "9ImSvqDDQuc"
    };

    return (
      <div className="content-section home-about-section">
        <div className="home-about-half-container">

          {/* about blurb */}
          <div className="home-about-half">

            <h2 className="font-xl">{ t("Home.AboutHeading") }</h2>

            <p className="font-md">{ t("Home.AboutParagraph1") }</p>
            <p className="font-md">{ t("Home.AboutParagraph2") }</p>
            <p className="font-md">{ t("Home.AboutParagraph3") }</p>

            {/* about page link */}
            <Link to="/about" className="button font-md">
              { t("Home.AboutButton") }
            </Link>
          </div>

          {/* video */}
          <div className="home-about-half">

            {/* container needed to make it responsive */}
            <div className="video-container">
              <iframe className="video-iframe"
                src={ `https://www.youtube-nocookie.com/embed/${ videos[locale] || videos.en }?rel=0` }
                frameBorder="0"
                allowFullScreen />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(HomeAbout);
