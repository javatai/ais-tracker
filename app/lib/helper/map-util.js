"use strict";

var MapUtil = {
  distance: function(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  },

  roundToDecimal: function (inputNum, numPoints) {
    var multiplier = Math.pow(10, numPoints)
    return Math.round(inputNum * multiplier) / multiplier
  },

  dmsStringToDecimal: function (dms) {
    return MapUtil.dmsToDecimal.apply(MapUtil, dms.split(" "))
  },

  formatDms: function (degrees, minutes, seconds, hemisphere) {
    var hemi = hemisphere.toUpperCase().substring(0,1)
    return degrees + "° " + minutes + "' " + seconds + '" ' + hemi
  },

  dmsToDecimal: function (degrees, minutes, seconds, hemisphere) {
    degrees = parseFloat(degrees)
    minutes = parseFloat(minutes)
    seconds = parseFloat(seconds)
    var ddVal = degrees + minutes / 60 + seconds / 3600
    ddVal = (hemisphere == "S" || hemisphere == "W") ? ddVal * -1 : ddVal
    return MapUtil.roundToDecimal(ddVal, 5)
  },

  decimalToDms: function (location, hemisphere){
    if( location < 0 ) location *= -1 // strip dash '-'

    var degrees = Math.floor(location) // strip decimal remainer for degrees
      , minutesFromRemainder = (location - degrees) * 60 // multiply the remainer by 60
      , minutes = Math.floor(minutesFromRemainder) // get minutes from integer
      , secondsFromRemainder = (minutesFromRemainder - minutes) * 60 // multiply the remainer by 60
      , seconds = MapUtil.roundToDecimal(secondsFromRemainder, 2)  // get minutes by rounding to integer

    return MapUtil.formatDms(degrees, minutes, seconds, hemisphere)
  },

  decimalLatToDms: function (location) {
    var hemisphere = (location < 0) ? "S" : "N" // south if negative
    return MapUtil.decimalToDms(location, hemisphere)
  },

  decimalLngToDms: function (location) {
    var hemisphere = (location < 0) ? "W" : "E" // west if negative
    return MapUtil.decimalToDms( location, hemisphere )
  },

  decimalToDmsList: function (location, hemisphere){
    if( location < 0 ) location *= -1; // strip dash '-'

    var degrees = Math.floor(location) // strip decimal remainer for degrees
      , minutesFromRemainder = (location - degrees) * 60 // multiply the remainer by 60
      , minutes = Math.floor(minutesFromRemainder) // get minutes from integer
      , secondsFromRemainder = (minutesFromRemainder - minutes) * 60 // multiply the remainer by 60
      , seconds = MapUtil.roundToDecimal(secondsFromRemainder, 2);  // get minutes by rounding to integer

    return {
      degrees: degrees,
      minutes: minutes,
      seconds: seconds,
      hemisphere: hemisphere
    }
  }
}

module.exports = MapUtil;
