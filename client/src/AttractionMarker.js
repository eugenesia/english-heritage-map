// A customised Marker class that is more performant.
import { Marker } from 'react-google-maps';

// Helper function: Check if 2 arrays are equal.
const arrayCompare = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i=0; i<arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

class AttractionMarker extends Marker {

  shouldComponentUpdate(nextProps) {
    // For a marker, only the child components (InfoWindow etc.) will change
    // with user interaction. So only update if the children change.
    if (! arrayCompare(this.props.children, nextProps.children)) {
      return true;
    }
    return false;
  }
}

export default AttractionMarker;

