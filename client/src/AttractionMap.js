/**
 * Map to show a list of attractions.
 */

// This comment tells JSHint that 'google' is defined globally and not to
// output an error.
/* global google */

import { default as React, Component } from "react";

import { GoogleMap, InfoWindow, OverlayView, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import { default as AttractionMarker } from './AttractionMarker';

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
    y: -(height / 2) + 10
  };
}


/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const GMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={8}
    defaultCenter={{ lat: 51.510, lng: 0.118 }} // London
    onZoomChanged={props.onZoomChanged}
  >
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={20}
      //minimumClusterSize={4}
    >
      {props.markers.map((marker, index) => (
        <AttractionMarker
          key={marker.id}
          attractionId={marker.id}
          position={new google.maps.LatLng(marker.lat, marker.lng)}
          // Set image to EH property icon.
          icon={marker.ownership === 'eh_property' ? ehPropertyIcon : assocAttractIcon}
          label={{
            // First letter of name.
            text: marker.title.substring(0,1),
            fontWeight: 'bold',
            fontSize: '32px',
            fontFamily: 'Times New Roman',
            // Choose label color to stand out against image background.
            color: marker.ownership === 'eh_property' ? '#000000' : '#00bb00',
          }}
          onClick={() => props.onMarkerClick(marker) }
        >
          {marker.showInfo &&
            <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
              {marker.infoWindowContent}
            </InfoWindow>
          }
          {props.showOverlays &&
            <OverlayView
              position={{ lat: marker.lat, lng: marker.lng }}
              mapPaneName={OverlayView.OVERLAY_LAYER}
              getPixelPositionOffset={getPixelPositionOffset}
            >
              <p>{marker.title}</p>
            </OverlayView>
          }
        </AttractionMarker>
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class AttractionMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      // Whether to show attraction name on ground in an overlay.
      showOverlays: false,
    }
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.handleMapMounted = this.handleMapMounted.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
  }

  // Create markers.
  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props === prevProps) {
      return;
    }
    let markers = this.props.attractions.map((attract, index) => {

      let description =
        (attract.description ? `<p>${attract.description}</p>` : '') +
        (attract.discount ? `<p>Discount: ${attract.discount}</p>` : '') +
        (attract.telephone ? `<p>Tel: ${attract.telephone}</p>` : '');

      return {
        id: attract.id,
        title: attract.name,
        description: attract.description,
        image: attract.image,
        link: attract.link,
        lat: attract.lat,
        lng: attract.lng,
        ownership: attract.ownership,
        // Whether to show info window.
        showInfo: false,
        infoWindowContent: (
          <div className='infowindow'>
            <h3 className='infowindow__title'>
              <a href={attract.link} target="_blank">{attract.name}</a>
            </h3>
            <a className='infowindow__propertylink' href={attract.link}
              target="_blank">
              <img className='infowindow__image' src={attract.image} alt={attract.name} />
            </a>
            {/* Some Assoc Attractions have HTML in description, need to preserve them. */}
            <div className='infowindow__description'
              dangerouslySetInnerHTML={{__html: description}}></div>
            <p className='infowindow__address'>
              <a className='infowindow__maplink'
                href={'https://maps.google.com/?q=' + attract.name + ', ' +
                attract.address}
                target='_blank'
                dangerouslySetInnerHTML={{__html: attract.address}} />
            </p>
          </div>
        ),
      };
    });
    this.setState({
      ...this.state,
      markers: markers
    });
  }


  // Need to get ref to map, to get zoom.
  handleMapMounted(map) {
    this._map = map;
  }


  // Only show ground text at high zoom.
  handleZoomChanged() {

    const nextZoom = this._map.getZoom();
    let showOverlays = this.state.showOverlays;

    if (nextZoom >= 10 & ! this.state.showOverlays) { 
      // Show all ground text.
      showOverlays = true;
    }
    else if (nextZoom < 10 && this.state.showOverlays) {
      // Hide all ground text.
      showOverlays = false;
    }
    // Don't change state unnecessarily.
    if (showOverlays !== this.state.showOverlays) {
      this.setState({
        ...this.state,
        showOverlays: showOverlays,
      });
    }
  }


  // Show the InfoWindow for the marker.
  handleMarkerClick(targetMarker) {
    // Update the target marker and create a new marker array with it.
    let newMarkers = this.state.markers.map(marker => {
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
    this.setState({ markers: newMarkers });
  }


  // Hide the InfoWindow for the marker.
  handleMarkerClose(targetMarker) {
    // Update the target marker and create a new marker array with it.
    let newMarkers = this.state.markers.map(marker => {
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
    this.setState({ markers: newMarkers });
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
        markers={this.state.markers}
        onMarkerClick={this.handleMarkerClick}
        onMarkerClose={this.handleMarkerClose}
        onZoomChanged={this.handleZoomChanged}
        onMapMounted={this.handleMapMounted}
        showOverlays={this.state.showOverlays}
      />
    );
  }
}

