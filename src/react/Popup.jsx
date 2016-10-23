import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import AirbnbParser from './AirbnbParser.js';
import StorageUtil from './StorageUtil.js';
import $ from 'jquery';

class Popup extends React.Component {
	constructor(props) {
		super(props);
	}

	getCurrentTabUrl(callback) {
	  // Query for the current, active browser tab
	  var queryInfo = { active: true, currentWindow: true };
	  chrome.tabs.query(queryInfo, function(tabs) {
	    // Fetch URL from tab handle
	    callback(tabs[0].url);
	  });
	}

	testUrl(url) {
  	// Check if Airbnb; disable button if not
  	var airbnbUrlRegex = new RegExp("https://www.airbnb.com");
  	if (!airbnbUrlRegex.test(url)) {
      console.info("You're not even on Airbnb!");
    }

    // Check if listing; disable button if not
    var listingUrlRegex = new RegExp("https://www.airbnb.com/rooms/[0-9]*");
    if (!listingUrlRegex.test(url)) {
    	console.info("You're on Airbnb, but not on a listing page!");
    }

    // Get unique identifier of the listing
    var getMatch = (regex, str) => regex.test(str) ? regex.exec(str)[1] : null;
    var id = getMatch(new RegExp("https://www.airbnb.com/rooms/([0-9]*)"), url);

    // See if it already exists or if it's completely new
    chrome.storage.sync.get(id, function (result) {
      if (!result || $.isEmptyObject(result)) {
      	console.info("Option to save new data");
      } else {
      	console.info("Option to update existing data");
      }
    });

	}

	// savedListingsToCSV() {
	//   chrome.storage.sync.get(null, function(result) {

	//     var listingIds = Object.keys(result);
	//     var listings = listingIds.map(id => result[id]);

	//     var csvData = "data:text/csv;charset=utf-8,"
	//     csvData += ("ID,Name,Price/Night,Total Price,Book Type,Starred,Accommodates,Bathrooms,Bedrooms,Beds,Check In,Check Out,Property Type,RoomType,Cancellation,URL"+"\n");
	//     listings.forEach(function(listing, index) {
	//       csvData += [
	//         listing.id, '"'+listing.summary.listingName+'"', listing.booking.perNightPrice, listing.booking.totalPrice, listing.booking.bookingType, listing.booking.travelerSaved,
	//         listing.space.accommodates, listing.space.bathrooms, listing.space.bedrooms, listing.space.beds, listing.space.checkIn, listing.space.checkOut, listing.space.propertyType, listing.space.roomType,
	//         listing.pricing.cancellation, listing.url
	//       ].join(",");
	//       csvData += index < listings.length ? "\n" : "";
	//     });

	//     var link = document.createElement("a");
	//     link.setAttribute("href", encodeURI(csvData));
	//     link.setAttribute("download", "listings.csv");
	//     document.body.appendChild(link);
	//     link.click();
	//   });
	// }

	componentDidMount() {

		StorageUtil.setUpChromeStorageListener();

		window.onload = () => {
			console.info("TODO: refresh view (window on-load)")
		};

		var getCurrentTabUrl = this.getCurrentTabUrl;
		var testUrl = this.testUrl;
		document.addEventListener('DOMContentLoaded', function() {
			getCurrentTabUrl(function(url) {
				let recordKey = AirbnbParser.parseRecordKey(url);
				if (recordKey && recordKey.trim().length>0) {
					// let airbnbData = AirbnbParser.parsePageData();
					// console.info(airbnbData);
				}
			});
		});

		chrome.runtime.onMessage.addListener(function(request, sender) {
		  if (request.action == "airbnbData") {
		    message.innerText = JSON.stringify(request.source);
		  }
		});

		chrome.runtime.onMessage.addListener(function(request, sender) {
		  if (request.action == "parsePageData") {
		  	console.info("got parsed page data!");
		  	console.info(request.source);
		  }
		});

	}

	executeScriptFromFile(file, callback) {
		chrome.tabs.executeScript(null, { file: file }, (results) => callback(results));
	}

	executeScriptFromCode(code, callback) {
		chrome.tabs.executeScript(null, { code: code }, (results) => callback(results));
	}

	parsePageData() {
    var url = window.location.href;
    console.info(url);
    var body = $('body');
    console.info(body.innerHTML);
    return body.innerHTML;
  }

	render() {
		return (
			<div className="popup">
				<Tabs>
			    <Tab label="Tab 1" >
			      <div>
			        This is sample text for tab 1!
			      </div>
			    </Tab>
			    <Tab
			      label="Tab 2"
			      data-route="/home"
			      onActive={(tab) => console.info(`A tab with this route property ${tab.props['data-route']} was activated.`)}
			    >
			      <div>
			      	This is an onActive example tab.
			      </div>
			    </Tab>
			  </Tabs>
			  <RaisedButton
					label="clear"
					primary={true}
					onTouchTap={() => {
						StorageUtil.clearData(() => console.info("CLEAR"));
					}}
				/>
				<RaisedButton
					label="save airbnb 1"
					primary={true}
					onTouchTap={() => {
						StorageUtil.saveData("airbnb", "1", {a:'b'}, ()=>console.info("SAVE"));
					}}
				/>
				<RaisedButton
					label="save airbnb 2"
					primary={true}
					onTouchTap={() => {
						StorageUtil.saveData("airbnb", "2", {c:'d'}, ()=>console.info("SAVE"));
					}}
				/>
				<RaisedButton
					label="delete airbnb 2"
					primary={true}
					onTouchTap={() => {
						StorageUtil.deleteData("airbnb", "2", ()=>console.info("DELETE"));
					}}
				/>
				<RaisedButton
					label="retrieve airbnb all"
					primary={true}
					onTouchTap={() => {
						StorageUtil.retrieveData("airbnb", null, (x)=>console.info(x));
					}}
				/>
				<hr />
				<RaisedButton
					label="save yelp 1"
					primary={true}
					onTouchTap={() => {
						StorageUtil.saveData("yelp", "1", {e:'f'}, ()=>console.info("SAVE"));
					}}
				/>
				<RaisedButton
					label="retrieve yelp 1"
					primary={true}
					onTouchTap={() => {
						StorageUtil.retrieveData("yelp", "1", (x)=>console.info(x));
					}}
				/>
				<hr />
				<RaisedButton
					label="parse body HTML"
					primary={true}
					onTouchTap={() => {
						// this.executeScriptFromFile('dist/jquery-3.1.1.min.js', () => {
						// 	this.executeScriptFromFile('src/airbnb-parser.js', () => {
						// 		console.info("injected airbnb parser!");
						// 	});
						// });
						
						// The following code works!!!
						this.executeScriptFromFile('dist/jquery-3.1.1.min.js', () => {
							this.executeScriptFromCode(`(${AirbnbParser.test.toString()})()`, () => {
								console.info("injected airbnb parser!");
							});
						});

					}}
				/>
			</div>
		);
	}
}

Popup.propTypes = {};

Popup.defaultProps = {};

export default Popup;