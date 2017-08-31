import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GettingStartedExample from './GettingStartedExample';
import _ from 'lodash';

const markers = [{
	position: {
		lat: 25.0112183,
		lng: 121.52067570000001,
	},
	key: `Taiwan`,
	defaultAnimation: 2,
}];

class App extends Component {
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
				<div style={{height: '400px', width: '400px'}}>
					<GettingStartedExample
						containerElement={
							<div style={{ height: `100%` }} />
						}
						mapElement={
							<div style={{ height: `100%` }} />
						}
						//onMapLoad={_.noop}
						//onMapClick={_.noop}
						markers={markers}
						//onMarkerRightClick={_.noop}
            toast={console.log}
					/>
				</div>
      </div>
    );
  }
}

export default App;
