//import { kml } from "@tmcw/togeojson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveEateriesData, retrieveGymsData } from "./FacilityDataReceiver";
import { parseKMLtoGeoJSON } from "./FacilityDataParser";


/**
 * Calculate the distance between two points in kilometres
 * @param {double} lat1 latitude of first point
 * @param {double} lon1  longitude of first point
 * @param {double} lat2 latitude of second point
 * @param {double} lon2 longitude of second point
 * @returns distance
 */
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

/**
 * Helper function to convert angle in degrees into radians
 * @param {double} deg angle in degrees
 * @returns angle in radian
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Returns the name of the waypoint/facility
 * @param {object} loc 
 * @returns name of location
 */
export const formatNames = (loc) => {
  let locName = loc.properties.NAME;
  return locName;
};

/**
 * Allows different types of facilities to be colored differently
 * @param {string} locType 
 * @returns color string
 */
export const pinColourtoggle = (locType) => {
  switch (true) {
    case locType == "Eatery": {
      return "red";
    }
    case locType == "Gym": {
      return "blue";
    }
    default: {
      return "red";
    }
  }
  // if (locType === "Eatery") {
  //   return "red";
  // }
  // if (locType === "Gym") {
  //   return "blue";
  // } else {
  //   return "red";
  // }
};

/**
 * Uses the FacilityDataReceiver to download the location data
 * @returns location data
 */
export const fetchLocationsData = async () => {
  const gymData = await retrieveGymsData();
  gymData.features.forEach(function (element) {
    element.properties.Type = "Gym";
    delete element.properties.description;
  });

  const eateriesData = await retrieveEateriesData();
  eateriesData.features.forEach(function (element) {
    element.properties.Type = "Eatery";
    delete element.properties.description;
  });
  const allData = gymData.features.concat(eateriesData.features);
  console.log(allData.length);
  storeLocationsData(allData.slice(0, 30).concat(allData.slice(1930, 1960)));
  return allData;
};

/**
 * Fetches and stores the location data into the AsyncStorage
 */
export const saveLocationsData = async () => {
  const isData = await getLocationsData();
  if (isData === null) {
    const locData = await fetchLocationsData();
    storeLocationsData(locData);
  }
};

/**
 * Stores the location data into the AsyncStorage
 * @param {object} value 
 */
const storeLocationsData = async (value) => {
  const isData = await getLocationsData();
  if (isData === null) {
    try {
      const jsonValue = JSON.stringify(value);
      //console.log(jsonValue);
      await AsyncStorage.setItem("@key_location_", jsonValue);
      console.log("saved ");
    } catch (e) {
      // saving error
      console.log("write error");
    }
  }
};

/**
 * Provides an option to clear the AsyncStorage
 */
export const clearAsyncStorage = async () => {
  AsyncStorage.getAllKeys()
    .then((keys) => AsyncStorage.multiRemove(keys))
    .then(() => alert("success"));
};

/**
 * Reads the location data from the AsyncStorage
 * @returns location data
 */
export const getLocationsData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@key_location_");
    if (jsonValue !== null) {
      //value previously stored
      return JSON.parse(jsonValue);
    } else {
      return null;
    }
  } catch (e) {
    console.log("read error");
    return null;
    // error reading value
  }
};
