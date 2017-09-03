/**
 * A tourist attraction e.g. a castle or a historical house.
 */

// Type of attraction.
const AttractionType = {
  EH_PROPERTY: 'English Heritage property',
  ASSOC_ATTRACTION: 'Associated Attraction',
}

// A tourist attraction.
class Attraction {

  constructor(name, lat, lng, type=AttractionType.EH_PROPERTY) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.type = type;

    // Description of the attraction - can contain HTML.
    this.description = null;
    // Photo of attraction.
    this.image = null;
    // Link for more info.
    this.link = null;
    // Physical address.
    this.address = null;
  }
}

export { Attraction, AttractionType };

