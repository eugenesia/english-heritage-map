// Selector allowing user to choose to show particular categories of properties.
import { default as React, Component } from 'react';

export default class CategoryFilter extends Component {

  static categoryLabels = {
    castles: 'Castles',
    medieval: 'Medieval and tudor',
    monument: 'Monuments and ruins',
    abbey: 'Abbeys and churches',
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
        <h2>Categories</h2>
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

