import AbstractParser from './AbstractParser.js';
import $ from 'jquery';

class AirbnbParser extends AbstractParser {
  constructor() {
    super('airbnb');
  }

  // componentWillMount() {
  //   chrome.runtime.sendMessage({
  //     action: "airbnbData",
  //     source: this.parsePageData()
  //   });
  // }

  static parseRecordKey(url) {
    let airbnbListingRegex = new RegExp("https://www.airbnb.com/rooms/([0-9]+)");
    console.info("PARSE AIRBNB RECORD KEY: " + AbstractParser.matchRegex(airbnbListingRegex, url, 1));
    return AbstractParser.matchRegex(airbnbListingRegex, url, 1);
  }

  static parsePageData2() {
    // Get the URL again for ID and specific booking info
    var url = window.location.href;
    return $('body').innerHTML;
  }

  static test() {
    chrome.runtime.sendMessage({
      action: "parsePageData",
      source: this.parsePageData()
    });
  }

  static parsePageData() {

    // Get the URL again for ID and specific booking info
    var url = window.location.href;

    // Provide local functions for extracting regex matches and for extracting data from DOM nodes
    var getMatch = (regex, str) => regex.test(str) ? regex.exec(str)[1] : null;
    var extractData = (node) => {
      if (node.children().length >= 3 && node.children()[0].textContent.endsWith(":")) {
        try {
          return node.children()[2].textContent.trim();   
        } catch (err) {}
      }
      return node.text().trim();
    };

    // Prepare object for storing data
    var data = {
      id: null,
      url: null,
      summary: {},
      booking: {},
      space: {},
      amenities: {},
      pricing: {},
      availability: {}
    };

    // Parse the id
    data.id = getMatch(new RegExp("https://www.airbnb.com/rooms/([0-9]*)"), url);
    data.url = url;

    // lookupListingData(data.id);
    // lookupAllListingData();

    // Summary
    data.summary.listingName = extractData($("#listing_name"));
    data.summary.hostName = extractData($("a[href='#host-profile'].text-wrap"));
    data.summary.hostRating = $("#display-address .star-rating-wrapper .star-rating").attr("content");
    data.summary.numReviews = extractData($("#display-address .star-rating-wrapper"));
    data.summary.neighborhood = extractData($("#display-address a[href='#neighborhood']"));

    // Booking (check-in/out dates, num guests, etc.)
    data.booking.checkInDate = getMatch(new RegExp("check_in=([0-9]*-[0-9]*-[0-9]*)"), url);
    data.booking.checkOutDate = getMatch(new RegExp("check_in=([0-9]*-[0-9]*-[0-9]*)"), url);
    data.booking.guests = getMatch(new RegExp("guests=([0-9]*)"), url);
    data.booking.bookingType = extractData($("button.btn-primary.btn-block:visible"));
    data.booking.travelerSaved = extractData($("span:contains('travelers saved this place')").parent())
      .replace(" travelers saved this place", "");
    // var nightString = " x 7 nights"
    // data.booking.perNightPrice = extractData($("span:contains('" + nightString + "')").parent()).replace(nightString, "");
    data.booking.perNightPrice = $(".book-it .book-it__price-amount").text().trim();
    data.booking.totalPrice = extractData($("td:contains('Total')").parent()).replace("Total", "");

    // Space
    data.space.accommodates = extractData($("span:contains('Accommodates')").parent());
    data.space.bathrooms = extractData($("span:contains('Bathrooms')").parent());
    data.space.bedrooms = extractData($("span:contains('Bedrooms')").parent());
    data.space.beds = extractData($("span:contains('Beds')").parent());
    data.space.checkIn = extractData($("span:contains('Check In')").parent());
    data.space.checkOut = extractData($("span:contains('Check Out')").parent());
    data.space.propertyType = extractData($("span:contains('Property type')").parent());
    data.space.roomType = extractData($("span:contains('Room type')").parent());

    // Amenities
    $("div.amenities .expandable-content-full .space-1").each(function() {
      data.amenities[$(this).text().trim()] = !$(this).hasClass("text-muted");
    });

    // Pricing
    data.pricing.extraPeople = extractData($("span:contains('Extra people')").parent());
    data.pricing.cleaningFee = extractData($("span:contains('Cleaning Fee')").parent());
    data.pricing.securityDeposit = extractData($("span:contains('Security Deposit')").parent());
    data.pricing.weeklyDiscount = extractData($("span:contains('Weekly discount')").parent());
    data.pricing.monthlyDiscount = extractData($("a:contains('Monthly discount')").parent());
    data.pricing.cancellation = extractData($("span:contains('Cancellation')").parent());
    data.pricing.weekendPrice = extractData($("span:contains('Weekend price')").parent());

    // Availability
    data.availability.minimumStay = extractData($("div.col-md-6:contains('minimum stay')")).replace("minimum stay", "").trim();

    // saveListingData(data.id, data);

    return data;
  }
}

export default AirbnbParser;