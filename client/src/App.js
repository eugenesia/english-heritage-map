import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import AttractionMap from './AttractionMap';
import PopularFilter from './PopularFilter';
import CategoryFilter from './CategoryFilter';

const ehBaseUrl = 'http://www.english-heritage.org.uk';
const ehPropertyIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-property.png';
const assocAttractIcon = ehBaseUrl + '/static/staticNM/icons/pin-single-other.png';

class App extends Component {

  constructor(props) {
    super(props);

    let catFilterInitState = {
      ...CategoryFilter.categoryLabels
    };
    Object.entries(CategoryFilter.categoryLabels).forEach(([catId]) => {
      catFilterInitState[catId] = false;
    });

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
      categoryFilter: catFilterInitState,
    };

    this.handlePopularFilterChange = this.handlePopularFilterChange.bind(this);
    this.handleCategoryFilterChange = this.handleCategoryFilterChange.bind(this);
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
      popularFilter: showPopular
    });
  }


  // Filter all the attractions through selected criteria.
  filterAttractions() {

    // If nothing is checked, show nothing.
    let allCategoriesFalse = Object.keys(this.state.categoryFilter)
      .every(catId => {
        return ! this.state.categoryFilter[catId];
      });

    // Category IDs selected.
    let selectedCatIds = Object.keys(this.state.categoryFilter)
      .filter(catId => {
        if (this.state.categoryFilter[catId]) {
          return true;
        }
        return false;
      });

    // Labels of categories selected.
    let selectedCatLabels = selectedCatIds.map(catId => {
      return CategoryFilter.categoryLabels[catId];
    });

    let newAttractions = this.state.attractions.map(attract => {
      // Whether this attraction is visible.
      let visible = false;

      // Nothing was checked, show everything.
      if (! this.state.popularFilter && allCategoriesFalse) {
        visible = true;
      }

      // This is a popular attraction, show it.
      if (this.state.popularFilter && attract.popular) {
        visible = true;
      }

      // Check if the categories match any of our selected ones.
      let categoryMatch = selectedCatLabels.some(label => {
        if (attract.categories.indexOf(label) !== -1) {
          return true;
        }
        return false;
      });
      if (categoryMatch) {
        visible = true;
      }

      let newAttract = {
        ...attract,
        visible: visible,
      };
      return newAttract;
    });
    return newAttractions;
  }


  // Handle category filter check/uncheck.
  handleCategoryFilterChange(catId, value) {
    let categoryState = {
      ...this.state.categoryFilter
    };
    categoryState[catId] = value;

    this.setState({
      ...this.state,
      categoryFilter: categoryState,
    });
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2 className="App-title">Heritage map</h2>
          <a className="App-subtitle" href="http://voltaireconsulting.com" target="_blank">By Voltaire Consulting</a>
          <p className="App-intro"> Map of English Heritage properties 
            <img src={ehPropertyIcon} alt="English Heritage property icon" />
            and Associated Attractions
            <img src={assocAttractIcon} alt="Associated Attraction icon" />.
          </p>
        </div>
        <div className="App-content">
          <div className="App-sidebar">
            <PopularFilter value={this.state.popularFilter} onChange={this.handlePopularFilterChange} />
            <CategoryFilter categories={this.state.categoryFilter} onChange={this.handleCategoryFilterChange} />
          </div>
          <div className="App-mapcontainer">
            <AttractionMap attractions={this.filterAttractions()} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
