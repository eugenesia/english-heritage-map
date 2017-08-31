/**
 * Map with markers and info windows, passed in using props.
 */
/* global google */
import { default as React, Component } from "react";

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

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
      />
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
      />
    );
  }
}

