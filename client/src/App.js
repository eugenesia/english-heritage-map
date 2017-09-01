import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfoMap from './InfoMap';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // List of markers on map.
      mapMarkers: []
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
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

  // Close info window when 'close' button clicked.
  handleMarkerClose(targetMarker) {
    // Update the target marker and create a new marker array with it.
    let newMarkers = this.state.mapMarkers.map(marker => {
      if (marker === targetMarker) {
        return {
          ...marker,
          // Hide info window for clicked marker.
          showInfo: false
        }
      }
      else {
        // Not the target marker, don't do anything.
        return marker;
      }
    });
    this.setState({ mapMarkers: newMarkers });
  }

  // Grab marker data from API.
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
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Heritage map</h2>
        </div>
        <p className="App-intro"> Map of English Heritage properties and Associated Attractions. </p>
				<div style={{height: '560px', width: '100%'}}>
          <InfoMap
            markers={this.state.mapMarkers}
            onMarkerClick={this.handleMarkerClick}
            onMarkerClose={this.handleMarkerClose}
          />
				</div>
      </div>
    );
  }
}

export default App;
