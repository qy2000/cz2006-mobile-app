import { parseKMLtoGeoJSON } from "./FacilityDataParser";

/**
 * Fetches and returns the locations of healthy eateries
 * @returns geojson
 */
export const retrieveEateriesData = async () => {
  const retrieveURL = await fetch(
    "https://data.gov.sg/api/action/package_show?id=healthier-eateries"
  );
  const URLres = await retrieveURL.text();
  const jsonRes = JSON.parse(URLres);

  const {
    result: {
      resources: [{ url: kmlurl }],
    },
  } = jsonRes;

  console.log(kmlurl);

  const parsedData = await parseKMLtoGeoJSON(kmlurl);
  return parsedData;
};

/**
 * Fetches and returns the locations of gyms
 * @returns geojson
 */
export const retrieveGymsData = async () => {
  const retrieveURL = await fetch(
    "https://data.gov.sg/api/action/package_show?id=gymssg"
  );
  const URLres = await retrieveURL.text();
  const jsonRes = JSON.parse(URLres);

  const {
    result: {
      resources: [{ url: kmlurl }],
    },
  } = jsonRes;

  console.log(kmlurl);

  const parsedData = await parseKMLtoGeoJSON(kmlurl);
  return parsedData;
};
