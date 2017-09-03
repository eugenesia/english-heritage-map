import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfoMap from './InfoMap';
import { Attraction, AttractionType } from './Attraction';
import AttractionMap from './AttractionMap';

let ehBaseUrl = 'http://www.english-heritage.org.uk';
let ehPropertyIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-property.png';
let assocAttractIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-other.png';

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

    let promises = [
      fetch('/ehproperties')
      .then(res => {
        return res.json();
      }),
      fetch('/assocattractions')
      .then(res => {
        return res.json();
      }),
    ];

    Promise.all(promises).then(allProperties => {
      let attractions = [];
      allProperties.map((allProperty, index) => {
        Object.entries(allProperty).forEach(([id, property]) => {
          let attractType = AttractionType.EH_PROPERTY;
          if (index === 1) {
            attractType = AttractionType.ASSOC_ATTRACTION;
          }
          let attract = this.createAttraction(property, attractType);
          attractions.push(attract);
        });
      });
      this.setState({attractions: attractions});
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
