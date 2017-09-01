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
      // List of English Heritage properties.
      ehproperties: {}
    };
  }

  componentDidMount() {
    // Fetch property data and update state.
    fetch('/ehproperties')
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.state.ehproperties = data;
        console.log('data:', data);
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
				<div style={{height: '600px', width: '800px'}}>
          <InfoMap markers={markers} />
				</div>
      </div>
    );
  }
}

export default App;
