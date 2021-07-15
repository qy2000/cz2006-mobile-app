import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Block, Button, Checkbox, Text, Input, theme } from "galio-framework";
const { height, width } = Dimensions.get("screen");
import { HeaderHeight } from "../constants/utils";

import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RadioGroup from "react-native-radio-buttons-group";
import ModalDropdown from "react-native-modal-dropdown";
import { UserContext } from "../context/UserContext";
import mrtLocation from "../constants/Location";
import avatars from "../constants/Avatars";
import { storeUserProfile } from '../controller/SetupManager';
import { invalidInput, invalidUsername } from '../controller/ProfileManager';

//https://github.com/ivpusic/react-native-image-crop-picker

export default function SignUp({ navigation }) {

  const [username, setUsername] = useState("");
  const { user, login } = useContext(UserContext);

  const radioButtonsData = [
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Male",
      value: "male",
    },
    {
      id: "2",
      label: "Female",
      value: "female",
    },
  ];

  const [radioButtons, setRadioButtons] = useState(radioButtonsData);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const mrtData = mrtLocation;
  const [mrt, setMRT] = useState(mrtData[0].value);
  const [hobbies, setHobbies] = useState("Running");


  /**
   * Wrapper function to pass data in UI to controller classs for setting up new profile
   */
  function handleProfileSetup() {
    if (!invalidInput(age, height, weight) && !invalidUsername(username)) {
      let data = { name: username, age, height, weight, mrt, hobbies, photoIndex };

      for (let i = 0; i < radioButtons.length; i++)
        if (radioButtons[i].selected) {
          data["gender"] = radioButtons[i].label;
          break;
        }
        storeUserProfile(user, data)
        .then(() => console.log("Done"))
        .then(() => login(user, data))
        .then(() => navigation.navigate("App"))
        .catch((error) => console.log(error));
    } else {
      alert("Input error. Please check again.");
    }
  }
  

  const [photoIndex, setPhotoIndex] = useState(0);
  const [photo, setAvatar] = useState(0);
  let currentAvatar = avatars[photo];

  const changeAvatarRight = () => {
    photo !== avatars.length - 1 ? setAvatar(photo + 1) : setAvatar(0);
    currentAvatar = avatars[photo];
    setPhotoIndex(photo+1);
  };

  const changeAvatarLeft = () => {
    photo !== 0 ? setAvatar(photo - 1) : setAvatar(avatars.length - 1);
    currentAvatar = avatars[photo];
    setPhotoIndex(photo-1);
  };

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
            <Block
              style={{
                flex: 5,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Image
                source={require("../assets/images/onboarding_mini.png")}
                style={{
                  height: 50,
                  width: 50,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: 28, marginLeft: 10 }}>
                Set up your profile!
              </Text>
            </Block>

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
                  onChangeText={setUsername}
                  value={username}
                />
              </Block>
              <Block style={{ marginBottom: 30, top: -5 }}>
                <RadioGroup
                  layout="row"
                  radioButtons={radioButtons}
                  onPress={setRadioButtons}
                  //containerStyle={{flex: 2}}
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
                <Text style={styles.mrt}>Nearest MRT: </Text>
                <Picker
                  name="mrtPicker"
                  selectedValue={mrt}
                  style={{ height: 30, width: 150, flex: 2 }}
                  textStyle={{ fontSize: 18 }}
                  onValueChange={(itemValue) => setMRT(itemValue)}
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
                  style={{ alignSelf: "center", width: 200, marginTop: 20 }}
                  fontWeight="bold"
                  color="#03adfc"
                  onPress={() => {
                    handleProfileSetup();
                  }}
                >
                  LET'S GO!
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
  block: {
    flex: 1,
    flexDirection: "row",
    marginRight: 0,
    padding: 10,
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "right",
    flex: 1,
  },
  gender: {
    fontSize: 20,
    marginTop: 45,
    textAlign: "right",
  },
  age: {
    fontSize: 20,
    marginTop: 40,
    textAlign: "right",
  },
  height: {
    fontSize: 20,
    marginTop: 40,
    textAlign: "right",
  },
  weight: {
    fontSize: 20,
    marginTop: 40,
    textAlign: "right",
  },
  mrt: {
    textAlign: "right",
    flex: 1,
    alignSelf: "center",
  },
  inputDetails: {
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 20,
  },

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
