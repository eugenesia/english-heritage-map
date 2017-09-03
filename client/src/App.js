import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfoMap from './InfoMap';
import { Attraction, AttractionType } from './Attraction';
import AttractionMap from './AttractionMap';

const ehBaseUrl = 'http://www.english-heritage.org.uk';
const ehPropertyIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-property.png';
const assocAttractIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-other.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // List of attractions on map.
      attractions: []
    };
  }

  // Grab attraction data from API.
  componentDidMount() {

    let attractionPromises = [
      this.fetchEhProperties(),
      this.fetchAssocAttractions(),
    ];

    // All fetch promises must resolve before continuing.
    Promise.all(attractionPromises).then(attractionLists => {
      // Consolidate EH property attractions and Associated Attractions.
      const attractions = attractionLists[0].concat(attractionLists[1]);
      this.setState({attractions: attractions});
    });
  }

  /**
   * Fetch the English Heritage property data from API, and convert them to
   * Attraction objects.
   */
  fetchEhProperties() {
    return fetch('/ehproperties')
    .then(res => {
      return res.json();
    })
    .then(allProperties => {
      const attractions = [];
      Object.entries(allProperties).forEach(([id, property]) => {
        let attract = new Attraction(
          property.t,
          parseFloat(property.lt),
          parseFloat(property.lg),
          AttractionType.EH_PROPERTY
        );
        attract.description = property.so;
        attract.address = property.add;
        attract.link = ehBaseUrl + property.p;
        attract.image = ehBaseUrl + property.tui;
        attractions.push(attract);
      });
      return attractions;
    });
  }

  /**
   * Fetch the Associated Attractions data from API, and convert them to
   * Attraction objects.
   */
  fetchAssocAttractions() {

    // Parse description from API data, and split it up into useful parts.
    const parseDescription = desc => {
      const regexStr = '^\n<p>\n?'
        // Address (may be enclosed by <strong>)
        + '(<strong>)?(.*?)\s?(<\/strong>)?\n<\/p>\n'
        // Description (optional).
        + '([\s\S]+)?'
        // Discount info.
        + '<p>\s?(<strong>[\s\S]+?)\s?\n<\/p>\n'
        // Telephone.
        + '<p>\n(&nbsp;)?([\d\s]+)'
        + '(&nbsp;|\s)\|(&nbsp;)? '
        // Link to webpage.
        + '<a .*? href="(.*?)(\r\n){0,2}"';
      const re = new RegExp(regexStr);

      const matches = desc.match(re);

      return {
        address: matches[2],
        description: matches[4],
        discount: matches[5],
        telephone: matches[7],
        link: matches[10],
      }
    }

    return fetch('/assocattractions')
    .then(res => {
      return res.json();
    })
    .then(allProperties => {
      const attractions = [];
      Object.entries(allProperties).forEach(([id, property]) => {
        let attract = new Attraction(
          property.t,
          parseFloat(property.lt),
          parseFloat(property.lg),
          AttractionType.ASSOC_ATTRACTION
        );

        let info = parseDescription(property.so);

        attract.address = info.address;
        attract.discount = info.discount;
        attract.link = info.link;
        attract.telephone = info.telephone;
        attract.description = info.description;
        attract.image = ehBaseUrl + property.tui;

        attractions.push(attract);
      });
      return attractions;
    });
  }
  /**
   * Create an Attraction object representing the property retrieved from API.
   */
  createAttraction(property, attractType) {
    const attract = new Attraction(property.t, property.lt, property.lg, attractType);
    attract.description = property.so;
    attract.address = property.add;
    return attract;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Heritage map</h2>
        </div>
        <p className="App-intro"> Map of English Heritage properties 
          <img src={ehPropertyIcon} />
          and Associated Attractions
          <img src={assocAttractIcon} />.
        </p>
				<div className="App-mapcontainer">
          <AttractionMap
            attractions={this.state.attractions}
          />
				</div>
      </div>
    );
  }
}

export default App;
