// Selector allowing user to select categories of properties to see.
import { default as React, Component } from 'react';

const categories = {
  popular: 'Popular',
  ehproperty: 'EH property',
  castle: 'Castle',
};

export default class CategoryFilter extends Component {

  constructor() {
    super();
    let state = {};
    Object.entries(categories).forEach(([categoryId]) => {
      // Set all categories to unselected initially.
      state[categoryId] = false;
    });
    this.state = state;
    this.handleChange = this.handleChange.bind(this);
  }

  // Update state when any input boxes changed.
  handleChange(event) {
    let categoryId = event.target.value;
    let checked = event.target.checked;

    let newState = this.state;
    newState[categoryId] = checked;
    this.setState(newState);
    console.log('State: ', this.state);
  }

  render() {
    return (
      <div>
        <h2>Categories</h2>
        {Object.keys(categories).map(categoryId => (
          <div key={`div_${categoryId}`}>
            <input type='checkbox' id={`category__${categoryId}`} key={`input_${categoryId}`} name='category' value={categoryId} checked={this.state[categoryId]} onChange={this.handleChange} />
            <label htmlFor={`category__${categoryId}`} key={`label_${categoryId}`}>{categories[categoryId]}</label>
          </div>
        ))}
      </div>
    );
  }
}

