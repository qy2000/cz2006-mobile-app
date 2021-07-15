import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
//import { CheckBox } from "react-native-elements";
import { Block, Text, Card } from "galio-framework";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SearchBar } from "react-native-elements";
import CheckBox from "@react-native-community/checkbox";
import {
  getDistanceFromLatLonInKm,
  formatNames,
  pinColourtoggle,
} from "../controller/LocationManager";
import { LinearGradient } from "expo-linear-gradient";
import { getLocationsData } from "../controller/LocationManager";

const { width } = Dimensions.get("screen");

export default function Locations() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [query, setQuery] = useState("");
  const [locNames, setLocNames] = useState([]);
  const [region, setRegion] = useState(null);
  const [distFilter, setDistFilter] = useState("All");
  const [eateriesFilter, setEateriesFilter] = useState(true);
  const [gymsFilter, setGymsFilter] = useState(true);
  const [locStatusGiven, setlocStatusGiven] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status === "granted") {
          setlocStatusGiven(true);
        } else {
          setErrorMsg("Permission to access location was denied");
          setRegion({
            latitude: 1.3521,
            longitude: 103.8198,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          });
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        });
        setIsLoading(false);
      } catch (error) {
        setRegion({
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
        console.log("There has been a problem with your fetch operation");
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentLocation]);

  useEffect(() => {
    mapDisplayData();
  }, [data, distFilter, eateriesFilter, gymsFilter]);

  /**
   * Fetch location data using LocationManager and get the distances from current location
   */
  const fetchData = async () => {
    // const res = await fetch("https://api.opendota.com/api/heroes");
    // const locationsArrayJSON = locJSON.features;
    // const json = await res.json();
    //const locationsArrayJSON = await fetchLocationsData();
    const locationsArrayJSON = await getLocationsData();

    if (currentLocation !== null) {
      locationsArrayJSON.forEach(function (element) {
        element.distFromCurrentLocation = getDistanceFromLatLonInKm(
          currentLocation.latitude,
          currentLocation.longitude,
          element.geometry.coordinates[1],
          element.geometry.coordinates[0]
        );
      });
    }

    setData(locationsArrayJSON);
    setLocNames(locationsArrayJSON.slice());
  };

  /**
   * Display the waypoints based on filters and types set by the user
   */
  const mapDisplayData = () => {
    switch (true) {
      case eateriesFilter === false && gymsFilter === false:
        setMapData([]);
        break;
      case eateriesFilter === true &&
        gymsFilter === true &&
        distFilter == "All":
        setMapData(data);
        break;
      case eateriesFilter === true &&
        gymsFilter === true &&
        distFilter == "1KM":
        {
          var onekmResult = data.filter(function (obj) {
            return obj.distFromCurrentLocation <= 1;
          });
          setMapData(onekmResult);
        }
        break;
      case eateriesFilter === true &&
        gymsFilter === true &&
        distFilter == "2KM":
        {
          var twokmResult = data.filter(function (obj) {
            return obj.distFromCurrentLocation <= 2;
          });
          setMapData(twokmResult);
        }
        break;
      case eateriesFilter === true &&
        gymsFilter === false &&
        distFilter == "All":
        {
          var eateriesResult = data.filter(function (obj) {
            return obj.properties.Type == "Eatery";
          });
          setMapData(eateriesResult);
        }
        break;
      case eateriesFilter === true &&
        gymsFilter === false &&
        distFilter == "1KM":
        {
          var eateriesResult = data.filter(function (obj) {
            return (
              obj.properties.Type == "Eatery" &&
              obj.distFromCurrentLocation <= 1
            );
          });
          setMapData(eateriesResult);
        }
        break;
      case eateriesFilter === true &&
        gymsFilter === false &&
        distFilter == "2KM":
        {
          var eateriesResult = data.filter(function (obj) {
            return (
              obj.properties.Type == "Eatery" &&
              obj.distFromCurrentLocation <= 2
            );
          });

          setMapData(eateriesResult);
        }
        break;

      case eateriesFilter === false &&
        gymsFilter === true &&
        distFilter == "All":
        {
          var gymsResult = data.filter(function (obj) {
            return obj.properties.Type == "Gym";
          });

          setMapData(gymsResult);
        }
        break;

      case eateriesFilter === false &&
        gymsFilter === true &&
        distFilter == "1KM":
        {
          var gymsResult = data.filter(function (obj) {
            return (
              obj.properties.Type == "Gym" && obj.distFromCurrentLocation <= 1
            );
          });

          setMapData(gymsResult);
        }
        break;
      case eateriesFilter === false &&
        gymsFilter === true &&
        distFilter == "2KM":
        {
          var gymsResult = data.filter(function (obj) {
            return (
              obj.properties.Type == "Gym" && obj.distFromCurrentLocation <= 2
            );
          });

          setMapData(gymsResult);
        }
        break;
      default:
        setMapData(data);
        break;
    }
    //setIsLoading(false);
  };

  /**
   * Filter the location waypoints based on user's query
   * @param {string} loc 
   * @returns list of location names matching user's query
   */
  const filterNames = (loc) => {
    let search = query.toLowerCase();
    if (loc.properties.NAME.toLowerCase().startsWith(search, 0)) {
      return formatNames(loc);
    } else {
      locNames.splice(locNames.indexOf(loc), 1);
      return null;
    }
  };

  const updateQuery = (input) => {
    setLocNames(data.slice());
    setQuery(input);
  };

  return (
    <Block flex>
      <LinearGradient
        colors={["transparent", "#FFD789"]}
        start={{ x: 0.1, y: 0.1 }}
        style={styles.linearGradient}
      >
        <SearchBar
          onChangeText={updateQuery}
          value={query}
          placeholder={"Search locations..."}
          lightTheme={true}
        />
        {isLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: Dimensions.get("window").height * 0.3,
            }}
          >
            <ActivityIndicator size="large" color="#5500dc" paddingTop={30} />
          </View>
        )}

        {isLoading === false && (
          <Block flex center={true}>
            <MapView
              style={styles.mapsize}
              initialRegion={region}
              showsUserLocation={true}
              zoomEnabled={true}
              provider={PROVIDER_GOOGLE}
            >
              {mapData.map((feature, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                  }}
                  title={feature.properties.NAME}
                  pinColor={pinColourtoggle(feature.properties.Type)}
                ></Marker>
              ))}
            </MapView>
          </Block>
        )}
        <KeyboardAvoidingView>
          <Block flex paddingTop={25} paddingLeft={45} paddingRight={100}>
            <View style={styles.filterDistContainer}>
              <Text style={styles.textHeader}>Show:</Text>
              <View style={styles.button_1}>
                <Button
                  title="All"
                  onPress={() => {
                    setDistFilter("All");
                  }}
                  color={distFilter === "All" ? "blue" : "grey"}
                />
              </View>
              <View style={styles.button_1}>
                <Button
                  title="1KM"
                  onPress={() => {
                    if (locStatusGiven) {
                      setDistFilter("1KM");
                    } else {
                      alert("Location Access Denied. Unable to get proximity.");
                    }
                  }}
                  color={distFilter === "1KM" ? "blue" : "grey"}
                />
              </View>
              <View style={styles.button_1}>
                <Button
                  title="2KM"
                  onPress={() => {
                    if (locStatusGiven) {
                      setDistFilter("2KM");
                    } else {
                      alert("Location Access Denied. Unable to get proximity.");
                    }
                  }}
                  color={distFilter === "2KM" ? "blue" : "grey"}
                />
              </View>
            </View>
          </Block>
          <Block flex paddingLeft={38} marginBottom={100} paddingTop={50}>
            <Card style={styles.cardCheckboxes}>
              <View paddingLeft={20} marginBottom={100} paddingBottom={10}>
                <View paddingBottom={8}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Show on map:
                  </Text>
                </View>
                <View style={{ flexDirection: "column" }}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      disabled={false}
                      value={gymsFilter}
                      onValueChange={(newValue) => setGymsFilter(newValue)}
                    />
                    <Text style={{ marginTop: 5 }}>
                      ActiveSG Gyms/SAFRA Centres
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      disabled={false}
                      value={eateriesFilter}
                      onValueChange={(newValue) => setEateriesFilter(newValue)}
                    />
                    <Text style={{ marginTop: 5 }}>Healthy Eateries</Text>
                  </View>
                </View>
              </View>
            </Card>
          </Block>
        </KeyboardAvoidingView>
        <Block flex Top={true} paddingTop={60}>
          {data !== null && (
            <View styles={styles.flatlistContainer}>
              <FlatList
                data={locNames}
                keyExtractor={(i) => i.properties.NAME.toString()}
                extraData={query}
                renderItem={({ item }) => (
                  <Text style={styles.flatList}>{filterNames(item)}</Text>
                )}
              />
            </View>
          )}
        </Block>
      </LinearGradient>
    </Block>
  );
}

const styles = StyleSheet.create({
  home: {
    width: Dimensions.get("window").width,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
    justifyContent: "center",
  },
  flatlistContainer: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
    justifyContent: "center",
    marginTop: -200,
  },
  flatList: {
    paddingLeft: 15,
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    flexGrow: 0,
    fontWeight: "800",
  },
  mapsize: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.3,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  filterDistContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  button_1: {
    width: "20%",
    height: 3,
  },
  cardCheckboxes: {
    //marginTop: 5,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.2,
    borderBottomColor: "grey",
    backgroundColor: "white",
    flexDirection: "column",
  },
  text: {
    paddingTop: 8,
    lineHeight: 20,
    fontWeight: "400",
    fontSize: 16,
  },
  textHeader: {
    paddingTop: 5,
    lineHeight: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
