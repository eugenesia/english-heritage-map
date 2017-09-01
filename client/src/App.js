import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfoMap from './InfoMap';


// Show points on map.
const markers = [
  {
    position: {lat: 51.4656554, lng: -0.0161922},
    infoContent: 'Lewisham station',
    showInfo: true,
  },
  {
    position: {lat: 51.8911008, lng: -0.4630409},
    infoContent: 'Luton',
    showInfo: true,
  },
];


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // List of markers on map.
      mapMarkers: []
    };
  }

  componentDidMount() {
    // Fetch property data and update state.
    fetch('/ehproperties')
      .then(res => {
        return res.json();
      })
      .then(data => {
        let markers = [];
        console.log('data:', data);
        for (let region in data.Region) {
          for (let county in data.Region[region]) {
            let properties = data.Region[region][county].properties;
            for (let i=0; i<properties.length; i++) {
              let property = properties[i];
              markers.push({
                position: { lat: property.lt, lng: property.lg },
                infoContent: property.t,
                showInfo: i % 10 === 0 ? true : false
              });
            }
          }
        }
        this.setState({ mapMarkers: markers });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
				<div style={{height: '600px', width: '100%'}}>
          <InfoMap markers={this.state.mapMarkers} handleMarkerClick={f=>f} />
				</div>
      </div>
    );
  }
}

export default App;
