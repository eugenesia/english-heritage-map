import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
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
        let attract = property;
        attract.type = 'ehproperty';
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

    return fetch('/assocattractions')
    .then(res => {
      return res.json();
    })
    .then(allProperties => {
      const attractions = [];
      Object.entries(allProperties).forEach(([id, property]) => {
        let attract = property;
        attract.type = 'assocattraction';
        attractions.push(attract);
      });
      return attractions;
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Heritage map</h2>
        </div>
        <p className="App-intro"> Map of English Heritage properties 
          <img src={ehPropertyIcon} alt="English Heritage property icon" />
          and Associated Attractions
          <img src={assocAttractIcon} alt="Associated Attraction icon" />.
        </p>
        <div className="App-content">
          <div className="App-sidebar">
            <p>Test</p>
          </div>
          <div className="App-mapcontainer">
            <AttractionMap
              attractions={this.state.attractions}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
