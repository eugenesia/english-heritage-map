// Selector allowing user to choose to show English Heritage properties or
// Associated Attractions.
import { default as React, Component } from 'react';

export default class OwnershipFilter extends Component {

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
        <h3>Ownership</h3>

        <label key='ehProperty'>
          <input type='checkbox' name='ehProperty'
            value={this.props.values.ehProperty}
            onChange={this.handleChange} />
          <span>English Heritage property</span>
          <br/>
        </label>

        <label key='assocAttraction'>
          <input type='checkbox' name='assocAttraction'
            value={this.props.values.assocAttraction}
            onChange={this.handleChange} />
          <span>Associated attraction</span>
          <br/>
        </label>
      </div>
    );
  }
}

