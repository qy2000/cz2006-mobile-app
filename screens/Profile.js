import React, { useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "react-native-vector-icons/FontAwesome";
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../context/UserContext";
import avatars from "../constants/Avatars";
import { getBMI, getRecomendedCal } from '../controller/ProfileManager';

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;


export default function Profile({ navigation }) {
  const { profile } = useContext(UserContext);

  return (
    <Block flex style={styles.profile}>
      <LinearGradient
        colors={["#FFD789", "transparent"]}
        style={styles.linearGradient}
      >
        <Block flex style={styles.topHalf}>
          <Block style={styles.editButton}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate("Edit Profile")}
            >
              <Icon style={styles.icon} name="pencil" size={20} color="black" />
            </TouchableOpacity>
          </Block>

          <Block style={{ alignSelf: "center" }}>
            <Block flex style={styles.profileImage}>
              <Image
                source={avatars[profile.photoIndex]}
                style={styles.image}
                resizeMode="center"
              ></Image>
            </Block>
          </Block>

          <Block style={styles.infoContainer}>
            <Text bold style={[styles.text, { fontSize: 22 }]}>
              {profile.name}
            </Text>
            <Text style={[styles.text, { fontSize: 14 }]}>
              {profile.age}, {profile.gender}
            </Text>
            <Text style={[styles.text, { fontSize: 14 }]}>{profile.mrt}</Text>
          </Block>
        </Block>

        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block row space="between" style={{ padding: theme.SIZES.BASE }}>
              <Block middle style={styles.infoCircle}>
                <Text bold size={25} style={{ marginBottom: 8 }}>
                  {profile.weight}
                </Text>
                <Text muted size={16}>
                  KG
                </Text>
              </Block>
              <Block middle style={styles.infoCircle}>
                <Text bold size={25} style={{ marginBottom: 8 }}>
                  {profile.height}
                </Text>
                <Text muted size={16}>
                  HEIGHT
                </Text>
              </Block>
              <Block middle style={styles.infoCircle}>
                <Text bold size={25} style={{ marginBottom: 8 }}>
                  {getBMI(profile.weight, profile.height)}
                </Text>
                <Text muted size={16}>
                  BMI
                </Text>
              </Block>
            </Block>

            <Block
              row
              space="between"
              style={{ paddingVertical: 16, alignItems: "baseline" }}
            >
              <Text bold size={16}>
                Recommended Calorie Intake
              </Text>
            </Block>
            <Block middle style={styles.infoCalories}>
              <Text bold size={25}>
                {/* {getRecomendedCal(profile.gender, profile.weight, profile.height, profile.age)} */}
                2140
              </Text>
              <Text muted size={20}>
                {" "}
                KCAL
              </Text>
            </Block>

            <Block
              row
              space="between"
              style={{ paddingVertical: 16, alignItems: "baseline" }}
            >
              <Text bold size={16}>
                Hobbies and Interests
              </Text>
            </Block>

            <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
              <Text>{profile.hobbies}</Text>
              <Block row space="between">
                {Images.Hobbies.map((img, imgIndex) => ( 
                  img.id.toUpperCase() === profile.hobbies.toUpperCase() &&
                  <Image
                    source={ img.require }
                    key={imgIndex}
                    resizeMode="cover"
                    style={styles.thumb}
                  />
                ))}
              </Block>
            </Block>
          </ScrollView>
        </Block>
      </LinearGradient>
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  topHalf: {
    top: 30,
    justifyContent: "center",
  },
  image: {
    marginTop: height / 6,
    width: width / 3,
    height: width / 3,
    resizeMode: "contain",
  },
  editButton: {
    position: "absolute",
    top: height / 7,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    padding: 12,
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 30,
  },
  infoContainer: {
    top: -180,
    alignItems: "center",
  },
  infoCircle: {
    borderRadius: width / 4.5,
    height: width / 4.5,
    width: width / 4.5,
    backgroundColor: "#FFD789",
  },
  infoCalories: {
    borderRadius: 100,
    height: height / 10,
    width: 0.8 * width,
    backgroundColor: "#FFD789",
    alignSelf: "center",
    flexDirection: "row",
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    position: "absolute",
  },
});
