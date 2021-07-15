import React, { useContext, useState, useRef, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView, View } from "react-native";
import { Block, Text, DeckSwiper, theme, Button } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../context/UserContext";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useIsFocused } from "@react-navigation/native";
import {
  CarouselCardItem,
  SLIDER_WIDTH,
  ITEM_WIDTH,
  data,
} from "../controller/HomeManager";
import {
  getLocationsData,
  saveLocationsData,
  fetchLocationsData,
  clearAsyncStorage,
} from "../controller/LocationManager";
import {
  cal_table_msg,
  cal_table_colour,
  getNetCal,
} from "../controller/CaloriesManager";

const { width, height } = Dimensions.get("screen");

export default function Home() {
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  const { profile } = useContext(UserContext);
  const isFocused = useIsFocused();
  var net_calories = getNetCal(isFocused);

  useEffect(() => {
    async function getLocData() {
      const locData = await getLocationsData();
      if (locData === null) {
        fetchLocationsData();
      } else {
        console.log("data stored in asyncstorage");
      }
    }

    try {
      getLocData();
    } catch (e) {
      console.log("data fetch failed as expected");
    }
  }, []);

  return (
    <Block flex style={styles.home}>
      <LinearGradient
        colors={["transparent", "#FFD789"]}
        start={{ x: 0.1, y: 0.1 }}
        style={styles.linearGradient}
      >
        <Block flex style={{ marginTop: 60, paddingBottom: 10 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block style={styles.title}>
              <Block style={{ flexDirection: "row", width: 0.8 * width }}>
                <Text size={28}>Welcome back, </Text>
                <Text bold size={28}>
                  {profile.name}
                </Text>
              </Block>
              <Text muted size={15}>
                Have you kept track of your calories today?
              </Text>
            </Block>

            <Block style={styles.title}>
              <Block style={styles.card}>
                <Text bold size={20} style={{ alignSelf: "flex-start" }}>
                  Calorie Information
                </Text>
                <Block style={styles.card2}>
                  <Text style={{ marginTop: 10, alignSelf: "center" }}>
                    {cal_table_msg(net_calories)}
                  </Text>
                  <Block
                    middle
                    flex
                    style={styles.infoBox2}
                    {...cal_table_colour(net_calories)}
                  >
                    <Text bold size={28}>
                      {net_calories} kcal
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>

            <Block style={styles.deck}>
              <View style={styles.carouselDeck}>
                <Carousel
                  layout="stack"
                  layoutCardOffset={9}
                  ref={isCarousel}
                  data={data}
                  renderItem={CarouselCardItem}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  onSnapToItem={(index) => setIndex(index)}
                  useScrollView={true}
                  loop={true}
                />
                <Pagination
                  dotsLength={data.length}
                  activeDotIndex={index}
                  carouselRef={isCarousel}
                  dotStyle={{
                    width: 5,
                    height: 5,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.92)",
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  tappableDots={true}
                />
              </View>
              {/* <ScrollView showsVerticalScrollIndicator={true}>
                <Block>
                  <Text bold size={18} style={{alignSelf:"center"}}>Tip on how to seek help to</Text>
                  <Text bold size={20} style={{alignSelf:"center"}}>MANAGE YOUR EMOTIONS</Text>
                  <Text style={{paddingTop:10}}>Speak to someone on the phone!</Text>
                  <Text>National Care Hotline: 1800 202 6868</Text>
                  <Text>Smartians of Singapore: 1800 221 4444</Text>
                  <Button color="info" style={{alignSelf:"center", marginTop:10}}>Read More...</Button>
                </Block>
                <Block>
                  <Text bold size={18} style={{alignSelf:"center"}}>Why is drinking</Text>
                  <Text bold size={20} style={{alignSelf:"center"}}>WATER IMPORTANT</Text>
                  <Text style={{paddingTop:10}}>Water carries oxygen and nutirents to cells and helps maintain immune function</Text>
                  <Button color="info" style={{alignSelf:"center", marginTop:10}}>Read More...</Button>
                </Block>
                {/* <DeckSwiper components={elements}/> */}
              {/* </ScrollView> */}
            </Block>
          </ScrollView>
        </Block>
      </LinearGradient>
    </Block>
  );
}

const elements = [
  <Block>
    <Text bold size={18} style={{ alignSelf: "center" }}>
      Tip on how to seek help to
    </Text>
    <Text bold size={20} style={{ alignSelf: "center" }}>
      MANAGE YOUR EMOTIONS
    </Text>
    <Text style={{ paddingTop: 10 }}>Speak to someone on the phone!</Text>
    <Text>National Care Hotline: 1800 202 6868</Text>
    <Text>Smartians of Singapore: 1800 221 4444</Text>
    <Button
      style={{ alignSelf: "center", marginTop: 10, backgroundColor: "#FFD789" }}
    >
      Read More...
    </Button>
  </Block>,
  <Block>
    <Text bold size={18} style={{ alignSelf: "center" }}>
      Why is drinking
    </Text>
    <Text bold size={20} style={{ alignSelf: "center" }}>
      WATER IMPORTANT
    </Text>
    <Text style={{ paddingTop: 10 }}>
      Water carries oxygen and nutirents to cells and helps maintain immune
      function
    </Text>
    <Button
      style={{ alignSelf: "center", marginTop: 10, backgroundColor: "#FFD789" }}
    >
      Read More...
    </Button>
  </Block>,
];

const styles = StyleSheet.create({
  home: {
    width: width,
    //backgroundColor:"#FFD789",
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    paddingLeft: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 2,
  },
  card2: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 45,
    borderRadius: 25,
    padding: 10,
    marginTop: 10,
  },
  title: {
    padding: 20,
    paddingHorizontal: 50,
    //backgroundColor:"white",
    alignSelf: "center",
  },
  deck: {
    padding: 20,
    paddingHorizontal: 30,
    alignSelf: "center",
    // backgroundColor: "white",
    height: 0.48 * height,
    width: width * 0.8,
    // borderRadius: 25,
    // elevation: 8,
    // shadowColor: "#000",
    // shadowRadius: 2,
  },
  carouselDeck: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox2: {
    paddingVertical: width / 30,
    paddingHorizontal: width / 20,
    borderRadius: 10,
    borderWidth: 0,
    flex: 0,
    marginTop: 10,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
    zIndex: 1,
  },
});
