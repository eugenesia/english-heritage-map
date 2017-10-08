// Selector allowing user to choose to show popular properties only.
import { default as React, Component } from 'react';

export default class PopularFilter extends Component {

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  // Update state when any input boxes changed.
  handleChange(event) {
    let checked = event.target.checked;
    this.props.onChange(checked);
  }

  render() {
    return (
      <div>
        <h3>Popular</h3>
        <input type='checkbox' id='filters__popular' name='popular'
          value={true} checked={this.props.value} onChange={this.handleChange} />
        <label htmlFor='filters__popular'>Most popular</label>
      </div>
    );
  }
}

