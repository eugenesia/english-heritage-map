import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import AttractionMap from './AttractionMap';
import PopularFilter from './PopularFilter';

const ehBaseUrl = 'http://www.english-heritage.org.uk';
const ehPropertyIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-property.png';
const assocAttractIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-other.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // List of attractions on map.
      attractions: [],
      // Show English Heritage properties only, or Associated Attractions only.
      ownershipFilter: {
        eh_property: true,
        assoc_attraction: true,
      },
      // Whether to show only popular attractions.
      popularFilter: false,
    };
    this.handlePopularFilterChange = this.handlePopularFilterChange.bind(this);
    this.filterAttractions = this.filterAttractions.bind(this);
  }

  // Grab attraction data from API.
  componentDidMount() {
    let attractionPromises = [
      this.fetchEhProperties(),
      this.fetchAssocAttractions(),
    ];

    // All fetch promises must resolve before continuing.
    Promise.all(attractionPromises).then(attractionLists => {
      // Consolidate EH property attractions and Associated Attractions.
      const attractions = attractionLists[0].concat(attractionLists[1]);
      this.setState({
        ...this.state,
        attractions: attractions,
      });
    });
  }

  /**
   * Fetch the English Heritage property data from API, and convert them to
   * Attraction objects.
   */
  fetchEhProperties() {
    return fetch('/ehproperties')
    .then(res => {
      return res.json();
    })
    .then(allProperties => {
      const attractions = [];
      Object.entries(allProperties).forEach(([id, property]) => {
        let attract = property;
        attractions.push(attract);
      });
      return attractions;
    });
  }


  /**
   * Fetch the Associated Attractions data from API, and convert them to
   * Attraction objects.
   */
  fetchAssocAttractions() {

    return fetch('/assocattractions')
    .then(res => {
      return res.json();
    })
    .then(allProperties => {
      const attractions = [];
      Object.entries(allProperties).forEach(([id, property]) => {
        let attract = property;
        attractions.push(attract);
      });
      return attractions;
    });
  }


  /**
   * Filter attractions based on "Most popular" status.
   */
  handlePopularFilterChange(showPopular) {
    this.setState({
      ...this.state,
      popularFilter: showPopular,
    });
  }


  // Filter all the attractions through selected criteria, and return a
  // pruned array of attractions.
  filterAttractions() {
    let allAttractions = this.state.attractions;

    let filteredAttractions = allAttractions.filter(attract => {
      // Popularity filter is off, show all attractions.
      if (! this.state.popularFilter) {
        return true;
      }
      // Popularity filter is on, only show popular attractions.
      else if (attract.popular) {
        return true;
      }
      return false;
    });
    return filteredAttractions;
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Heritage map</h2>
        </div>
        <p className="App-intro"> Map of English Heritage properties 
          <img src={ehPropertyIcon} alt="English Heritage property icon" />
          and Associated Attractions
          <img src={assocAttractIcon} alt="Associated Attraction icon" />.
        </p>
        <div className="App-content">
          <div className="App-sidebar">
            <PopularFilter onChange={this.handlePopularFilterChange} />
          </div>
          <div className="App-mapcontainer">
            {/* Pass a filtered list of attractions to the map. */}
            <AttractionMap
              attractions={this.filterAttractions()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
