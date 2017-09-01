/**
 * Map with markers and info windows, passed in using props.
 */

// This comment tells JSHint that 'google' is defined globally and not to
// output an error.
/* global google */

import { default as React, Component } from "react";

import { GoogleMap, InfoWindow, Marker, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

let ehPropertyIcon = 'http://www.english-heritage.org.uk/static/staticNM/icons/pin-single-property.png';
let assocAttractIcon = 'http://www.english-heritage.org.uk/static/staticNM/icons/pin-single-other.png';

/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const InfoGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 51.510, lng: 0.118 }} // London
  >
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
			{/* Render each marker. */}
			{props.markers.map((marker, index) => (
				<Marker
					key={index}
					position={new google.maps.LatLng(marker.position.lat, marker.position.lng)}
          // Set image to EH property icon.
          icon={marker.iconType === 'ehproperty' ? ehPropertyIcon : assocAttractIcon}
					onClick={() => props.onMarkerClick(marker) }
				>
					{/* Show InfoWindow only if marker.showInfo is true */
						marker.showInfo &&
						<InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
							<div>{marker.infoContent}</div>
						</InfoWindow>
					}
				</Marker>
			))}
    </MarkerClusterer>
  </GoogleMap>
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class InfoMap extends Component {

  render() {
    return (
      <InfoGoogleMap
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        markers={this.props.markers}
        onMarkerClick={this.props.onMarkerClick}
        onMarkerClose={this.props.onMarkerClose}
      />
    );
  }
}

