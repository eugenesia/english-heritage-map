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

  constructor(id, name, lat, lng, type=AttractionType.EH_PROPERTY) {
    // Numeric ID from English Heritage database.
    this.id = id;
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
    // Information about any ticket discounts.
    this.discount = null;
    // Telephone number.
    this.telephone = null;
  }
}

export { Attraction, AttractionType };

