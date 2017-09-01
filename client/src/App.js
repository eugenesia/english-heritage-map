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
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  // Show the info window for the marker when clicked.
  handleMarkerClick(targetMarker) {
    // Update the target marker and create a new marker array with it.
    let newMarkers = this.state.mapMarkers.map(marker => {
      if (marker === targetMarker) {
        return {
          ...marker,
          // Show info window for clicked marker.
          showInfo: true
        }
      }
      else {
        // Not the target marker, don't do anything.
        return marker;
      }
    });
    this.setState({ mapMarkers: newMarkers });
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
                // Hide info window until clicked.
                showInfo: false
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
				<div style={{height: '560px', width: '100%'}}>
          <InfoMap markers={this.state.mapMarkers} onMarkerClick={this.handleMarkerClick} />
				</div>
      </div>
    );
  }
}

export default App;
