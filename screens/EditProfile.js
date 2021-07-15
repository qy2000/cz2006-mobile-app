import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Picker,
} from "react-native";
import { Block, Text, Input, Button } from "galio-framework";

import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderHeight } from "../constants/utils";
import { updateProfileToFirebase } from "../controller/ProfileUpdater";
import { UserContext } from "../context/UserContext";
import mrtLocation from "../constants/Location";
import avatars from "../constants/Avatars";
import { invalidInput, invalidUsername } from '../controller/ProfileManager';

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

export default function EditProfile({ navigation }) {
  const { profile, user, updateProfile } = useContext(UserContext);
  const [scroll, setScroll] = useState(true);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [mrt, setMrt] = useState(profile.mrt);
  const [hobbies, setHobbies] = useState(profile.hobbies);
  const [mrtData, setMrtData] = useState(mrtLocation);

  const [photoIndex, setPhotoIndex] = useState(profile.photoIndex);
  const [photo, setAvatar] = useState(profile.photoIndex);
  let currentAvatar = avatars[photo];

  /**
   * Allows the user to scroll through (to the left) and select their preferred avatar
   */
  const changeAvatarRight = () => {
    photo !== avatars.length - 1 ? setAvatar(photo + 1) : setAvatar(0);
    currentAvatar = avatars[photo];
    setPhotoIndex(photo+1);
  };

  /**
   * Allows the user to scroll through (to the right) and select their preferred avatar
   */
  const changeAvatarLeft = () => {
    photo !== 0 ? setAvatar(photo - 1) : setAvatar(avatars.length - 1);
    currentAvatar = avatars[photo];
    setPhotoIndex(photo-1);
  };

  useEffect(() => {
    setMrtData(mrtLocation);
  }, []);

  /**
   * Handles user profile edit action
   */
  function editProfileHandler() {
    if (!invalidInput(age,height,weight) && !invalidUsername(name)) {
      let newProfile = { name, age, height, weight, mrt, hobbies, photoIndex };
      updateProfileToFirebase(user, { ...profile, ...newProfile })
        .then(() => updateProfile({ ...profile, ...newProfile }))
        .then(() => navigation.navigate("Profile"))
        .catch((error) => console.log(error));
    } 
    else {
      alert("Please fill up all fields.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Block
            style={{
              backgroundColor: "#FFD789",
              flex: 1,
              top: -height / 10,
              padding: 24,
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
            <Block style={{ flexDirection: "row", justifyContent: "center" }}>
              <Block style={styles.editButton}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={changeAvatarRight}
                >
                  <Icon
                    style={styles.icon}
                    name="chevron-right"
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
              </Block>

              <Block style={styles.editButton2}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={changeAvatarLeft}
                >
                  <Icon
                    style={styles.icon}
                    name="chevron-left"
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
              </Block>

              <Block style={{ alignSelf: "center" }}>
                <Image
                  source={currentAvatar}
                  style={styles.avatar}
                  resizeMode="center"
                />
              </Block>
            </Block>

            <Block style={styles.editDetails}>
              <Block style={styles.inputDetails}>
                <Text>Name: </Text>
                <Input
                  style={{ borderRadius: 10, top: -20 }}
                  color="black"
                  onChangeText={setName}
                  value={name}
                />
              </Block>

              <Block style={styles.inputDetails}>
                <Text>Age: </Text>
                <Input
                  style={{ borderRadius: 10, top: -20, width: 80 }}
                  color="black"
                  onChangeText={setAge}
                  value={age}
                />
              </Block>

              <Block style={styles.inputDetails}>
                <Text>Height: </Text>
                <Input
                  style={{ borderRadius: 10, top: -20, width: 80 }}
                  color="black"
                  onChangeText={setHeight}
                  value={height}
                />
                <Text> cm</Text>
              </Block>

              <Block style={styles.inputDetails}>
                <Text>Weight: </Text>
                <Input
                  style={{ borderRadius: 10, top: -20, width: 80 }}
                  color="black"
                  onChangeText={setWeight}
                  value={weight}
                />
                <Text> kg</Text>
              </Block>

              <Block style={styles.inputDetails}>
                <Text>Nearest MRT: </Text>
                <TouchableOpacity>
                  <Picker
                    name="mrtPicker"
                    selectedValue={mrt}
                    style={{ height: 50, width: 150, top: -18 }}
                    textStyle={{ fontSize: 18 }}
                    onValueChange={(itemValue, itemIndex) => setMrt(itemValue)}
                  >
                    {mrtData.map((item, index) => {
                      return (
                        <Picker.Item
                          label={item.label}
                          value={item.value}
                          key={index}
                        />
                      );
                    })}
                  </Picker>
                </TouchableOpacity>
              </Block>

              <Block style={styles.inputDetails}>
                <Text style={styles.mrt}>Hobbies: </Text>
                <Picker
                  name="hobbyPicker"
                  selectedValue={hobbies}
                  style={{ height: 30, width: 150, flex: 2 }}
                  textStyle={{ fontSize: 18 }}
                  onValueChange={(itemValue) => setHobbies(itemValue)}
                >   
                  <Picker.Item
                    label="Running"
                    value="Running"
                  />
                  <Picker.Item
                    label="Cycling"
                    value="Cycling"
                  />
                </Picker>
              </Block>

              <Block center style={{ zIndex: 1 }}>
                <Button
                  style={styles.saveButton}
                  fontWeight="bold"
                  onPress={() => editProfileHandler()}
                >
                  Save changes
                </Button>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD789",
  },
  page: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  mrt: {
    textAlign: "right",
    flex: 1,
    alignSelf: "center",
  },
  editButton: {
    position: "absolute",
    top: 45,
    right: 60,
    alignItems: "center",
    flexDirection: "row",
  },
  editButton2: {
    position: "absolute",
    top: 45,
    left: 60,
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    padding: 12,
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 30,
  },
  editDetails: {
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 20,
  },
  inputDetails: {
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 20,
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
  saveButton: {},
});
