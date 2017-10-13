// Selector allowing user to choose to show particular categories of properties.
import { default as React, Component } from 'react';

export default class CategoryFilter extends Component {

  // All the category labels found on the API data.
  // TODO: Dynamically generate these based on data.
  static categoryLabels = {
    abbey: 'Abbeys and churches',
    audio: 'Audio tours',
    castle: 'Castles',
    coastal: 'Coastal',
    // eh: 'EH Property',
    free: 'Free to Enter',
    garden: 'Gardens',
    hadrian: 'Hadrian\'s Wall',
    house: 'Houses and palaces',
    medieval: 'Medieval and tudor',
    memorial: 'Memorials',
    monument: 'Monuments and ruins',
    ovp: 'OVP (Overseas Visitors Pass)',
    prehistoric: 'Prehistoric',
    roman: 'Roman',
  }

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  // Update state when any input boxes changed.
  // Trigger the onChange handler passed in by parent.
  handleChange(evt) {
    const catId = evt.target.name;
    const value = evt.target.checked;
    this.props.onChange(catId, value);
  }


  render() {
    return (
      <div>
        <h3>Categories</h3>
        {Object.keys(CategoryFilter.categoryLabels).map(catId => {
          let catLabel = CategoryFilter.categoryLabels[catId];

          return (
            <label key={catId}>
              <input type='checkbox'
                name={catId}
                value={this.props.categories[catId]} 
                onChange={this.handleChange}
              />
              {catLabel}
              <br/>
            </label>
          );
        })
        }
      </div>
    );
  }
}

