/**
 * Map to show a list of attractions.
 */

// This comment tells JSHint that 'google' is defined globally and not to
// output an error.
/* global google */

import { default as React, Component } from "react";

import { GoogleMap, InfoWindow, Marker, OverlayView, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import { AttractionType } from './Attraction';

let ehPropertyIcon = {
  url: 'http://www.english-heritage.org.uk/static/staticNM/icons/pin-single-property.png',
  scaledSize: new google.maps.Size(32, 50),
  // For label text placement.
  origin: new google.maps.Point(0, -10),
  // Base of icon in center.
  anchor: new google.maps.Point(16, 50),
}

let assocAttractIcon = {
  url: 'http://www.english-heritage.org.uk/static/staticNM/icons/pin-single-other.png',
  scaledSize: new google.maps.Size(32, 50),
  // For label text placement.
  origin: new google.maps.Point(0, -10),
  // Base of icon in center.
  anchor: new google.maps.Point(16, 50),
}


/**
 * Function for positioning the custom overlay.
 * Position it slightly lower than centre.
 */
function getPixelPositionOffset(width, height) {
  return {
    x: -(width / 2),
    // 20px below centre.
    y: -(height / 2) + 20
  };
}


/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const GMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 51.510, lng: 0.118 }} // London
  >
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={20}
      //minimumClusterSize={4}
    >
			{/* Render each attraction. */}
			{props.attractions.map((attract, index) => (
				<Marker
					key={index}
					position={new google.maps.LatLng(attract.lat, attract.lng)}
          // Set image to EH property icon.
          icon={attract.type === AttractionType.EH_PROPERTY ? ehPropertyIcon : assocAttractIcon}
          label={{
            // First letter of name.
            text: attract.name.substring(0,1),
            fontWeight: 'bold',
            fontSize: '32px',
            fontFamily: 'Times New Roman',
            // Choose label color to stand out against image background.
            color: attract.type === AttractionType.EH_PROPERTY ? '#000000' : '#00bb00',
          }}
					onClick={() => props.onMarkerClick(attract) }
				>
          <OverlayView
            position={{ lat: attract.lat, lng: attract.lng }}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <p>{attract.name}</p>
          </OverlayView>
				</Marker>
			))}
    </MarkerClusterer>
  </GoogleMap>
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class AttractionMap extends Component {

  // Show the InfoWindow for the marker.
  onMarkerClick(targetMarker) {
  }

  // Hide the InfoWindow for the marker.
  onMarkerClose(targetMarker) {
  }

  render() {
    return (
      <GMap
        containerElement={
          <div style={{ height: '100%' }} />
        }
        mapElement={
          <div style={{ height: '100%' }} />
        }
        attractions={this.props.attractions}
        onMarkerClick={this.onMarkerClick}
        onMarkerClose={this.onMarkerClose}
      />
    );
  }
}

