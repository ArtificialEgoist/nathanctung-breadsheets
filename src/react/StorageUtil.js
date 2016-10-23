const storage = chrome.storage.sync;

export default class StorageUtil {
	constructor() {}

	static setUpChromeStorageListener(callback) {
		chrome.storage.onChanged.addListener(function(changes, namespace) {
				if (callback) {
					callback(changes);
				}
		});
	}

	static clearData(callback) {
		storage.clear(callback);
	}

	static saveData(partition, key, data, callback) {
		// Get all saved items
		storage.get(null, function(items) {
			// See if specified partition exists; if not, initialize it
			if (!items[partition]) {
				items[partition] = {};
			}
			// Save key-data pair to partition
			items[partition][key] = data;
			// Persist changes to storage
			storage.set(items, function(items) {
				console.info(`Saved data for partition=${partition}, key=${key}`);
				// Apply callback
				if (callback) callback(items);
			});
		});
	}

	static retrieveData(partition, key, callback) {
		// Get specified partition
		storage.get(partition, function(items) {
			console.info(`Retrieved data for partition=${partition}, key=${key}`);
			if (callback) {
				if (key) {
					// Apply callback for key-specific data or null if it doesn't exist
					callback(items[partition] ? items[partition][key] : null);
				} else {
					// If no key provided, apply general callback
					callback(items);
				}
			}
		});
	}

	static deleteData(partition, key, callback) {
		// Get specified partition
		storage.get(partition, function(items) {
			// Delete key from partition
			delete items[partition][key];
			// Persist changes to storage
			storage.set(items, function(items) {
				console.info(`Deleted data for partition=${partition}, key=${key}`);
				// Apply callback
				if (callback) callback(items);
			});
		});
	}
	
	// static saveData(key, data) {
	//   var obj = {};
	//   obj[key] = data;
	//   chrome.storage.sync.set(obj, function() {
	//   	console.info(`Saved data for ${key}`);
	//   });
	// }

	// static getSavedData(key) {
	//   chrome.storage.sync.get(key, function(result) {
	//   	console.info(`Retrieved data for ${key}`);
	//   });
	// }

	// static getAllSavedData() {
	//   chrome.storage.sync.get(null, function(result) {
	//   	console.info(`Retrieved all data with keys ${Object.keys(result)}`);
	//   });
	// }

	// static deleteData(key) {
	//   chrome.storage.sync.remove(key, function() {
	//   	console.info(`Deleted data for ${key}`);
	//   });
	// }
	
}