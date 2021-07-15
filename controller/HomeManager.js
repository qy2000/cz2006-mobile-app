import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

export const data = [
  {
    title: "Tips on how to seek help ",
    body1: "Speak to someone on the phone!",
    body2: "National Care Hotline: 1800 202 6868.",
    imgUrl:
      "https://image.freepik.com/free-vector/group-therapy-illustration-concept_52683-45502.jpg",
  },
  {
    title: "Drinking water is important",
    body1: "Drink at least 7 cups of water a day.",
    body2: "Water helps to maintain immune function.",
    imgUrl:
      "https://image.freepik.com/free-vector/tiny-woman-pouring-clean-water-from-faucet-with-mountain-landscape_74855-11024.jpg",
  },
  {
    title: "Eating healthy is important",
    body1: "Consume a balanced diet.",
    body2: "Add less salt and sugar.",
    imgUrl:
      "https://image.freepik.com/free-vector/illustration-healthy-lifestyle_53876-37161.jpg",
  },
  {
    title: "Be active",
    body1: "Exercise regularly, at least once a week.",
    body2: "Some examples include running & swimming.",
    imgUrl:
      "https://image.freepik.com/free-vector/couple-running-health-conscious-concept-sporty-woman-man-jogging-illustration-runners_1150-39751.jpg",
  },
];

/**
 * Defines a component to be added to the Carousel Card for display on home page
 * @param {item} carouselCardDetails information to be displayed to the user 
 * @returns 
 */
export const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.card} key={index}>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <Text style={styles.header}>{item.title}</Text>
      <Text style={styles.body1}>{item.body1}</Text>
      <Text style={styles.body2}>{item.body2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width * 0.78,
    height: Dimensions.get("window").height * 0.38,
    borderBottomColor: "grey",
    borderRightColor: "grey",
    backgroundColor: "white",
    flexDirection: "column",
    //alignItems: "center",
    //justifyContent: "space-around",
    //padding: 10,
    // padding: 20,
    // paddingHorizontal: 30,
    alignSelf: "center",
    // backgroundColor: "white",

    borderRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 2,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    width: ITEM_WIDTH,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  image: {
    width: Dimensions.get("window").width * 0.78,
    height: Dimensions.get("window").height * 0.25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 5,
  },
  body1: {
    color: "#222",
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 5,
  },
  body2: {
    color: "#222",
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 10,
  },
});
