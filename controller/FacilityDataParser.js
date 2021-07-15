/**
 * Fetches the kml file from data api and returns the geojson
 * @param {url} kmlurlinput 
 * @returns geojson
 */
export const parseKMLtoGeoJSON = async (kmlurlinput) => {
  try {
    const tj = require("@tmcw/togeojson");
    const DOMParser = require("xmldom").DOMParser;
    const kmlfile = await fetch(kmlurlinput);
    const datakml = await kmlfile.text();

    // read in our KML file and then parse it
    const parsedKML = new DOMParser().parseFromString(datakml, "utf8");

    // convert our kml to geojson and store the results
    const geojson = tj.kml(parsedKML);
    console.log(geojson.features[1]);

    return geojson;
  } catch (error) {
    console.log("Error in fetching kml and parsing to form geojson");
  }
};
