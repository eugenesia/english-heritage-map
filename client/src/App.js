import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfoMap from './InfoMap';

let ehBaseUrl = 'http://www.english-heritage.org.uk';

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
      let markers = [];
      allProperties.map((allProperty, index) => {
        Object.entries(allProperty).forEach(([id, property]) => {
          let iconType = 'ehproperty';
          if (index === 1) {
            iconType = 'assocattraction';
          }
          let marker = this.createMarkerObj(property, iconType);
          markers.push(marker);
        });
      });
      this.setState({mapMarkers: markers});
    });
  }

  /**
   * Create a marker object to be fed into the component.
   */
  createMarkerObj(property, iconType) {
    let marker = {
      position: { lat: property.lt, lng: property.lg },
      infoContent:
        <div className='infowindow'>
          <h3 className='infowindow__title'>{property.t}</h3>
          <a className='infowindow__propertylink' href={ehBaseUrl + property.p} target="_blank">
            <img className='infowindow__image' src={(property.tui.substring(0, 4) === 'http' ? '' : ehBaseUrl) + property.tui} />
          </a>
          {/* Some Assoc Attractions have HTML in description, need to preserve them. */}
          <div className='infowindow__description' dangerouslySetInnerHTML={{__html: property.so}}></div>
          <p className='infowindow__address'>
            <a className='infowindow__maplink' href={'https://maps.google.com/?q=' + property.add} target='_blank'>
              {property.add}
            </a>
          </p>
        </div>,
      // Hide info window until clicked.
      showInfo: false,
      iconType: iconType,
      // Set first letter of property as label so easier to distinguish on map.
      label: property.t.substring(0,1),
    };
    return marker;
  }

  htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Heritage map</h2>
        </div>
        <p className="App-intro"> Map of English Heritage properties and Associated Attractions. </p>
				<div className="App-mapcontainer">
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
