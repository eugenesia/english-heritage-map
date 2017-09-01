/**
 * Map with markers and info windows, passed in using props.
 */

// This comment tells JSHint that 'google' is defined globally and not to
// output an error.
/* global google */

import { default as React, Component } from "react";

import { GoogleMap, InfoWindow, Marker, withGoogleMap } from 'react-google-maps';

/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const InfoGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 51.510, lng: 0.118 }} // London
  >
    {/* Render each marker. */}
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={new google.maps.LatLng(marker.position.lat, marker.position.lng)}
        onClick={() => props.onMarkerClick(marker) }
      >
        {/* Show InfoWindow only if marker.showInfo is true */
          marker.showInfo &&
          <InfoWindow>
            <div>{marker.infoContent}</div>
          </InfoWindow>
        }
      </Marker>
    ))}
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
        omMarkerClick={this.props.handleMarkerClick}
      />
    );
  }
}

