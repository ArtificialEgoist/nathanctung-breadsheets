import $ from 'jquery';

export default class AbstractParser {
  static matchRegex(regex, str, index) {
    if (regex.test(str)) {
      let groups = regex.exec(str);
      if (groups.length > index) {
        return groups[index];
      }
    }
    return null;
  }

  constructor(siteKey) {
    // Prevent class from being constructed
    if (new.target === AbstractParser) {
      throw new TypeError('Cannot instantiate Abstract class');
    }
    // Validate siteKey
    if (!siteKey || typeof str !== 'string' || str.trim().length === 0) {
      throw new TypeError('Non-empty string parameter <siteKey> must be provided')
    }
    this._siteKey = siteKey;
  }

  getSiteKey() {
    return this._siteKey;
  }

  parseRecordKey(url) {
    // TODO: implement in subclass
    return null;
  }

  parsePageData() {
    // TODO: implement in subclass
    return null;
  }
}