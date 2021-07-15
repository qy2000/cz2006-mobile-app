import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";

import { SocialIcon, Divider } from "react-native-elements";

import { Block, Button, Text, theme } from "galio-framework";
const { height, width } = Dimensions.get("screen");
import { Input } from "react-native-elements";

import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { UserContext } from "../context/UserContext";
import { EmailLoginHandler } from "../controller/LoginManager";
import { clearAsyncStorage } from "../controller/LocationManager";

export default function Login({ navigation }) {
  const { navigate } = navigation;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginErrorCode, setLoginErrorCode] = useState("");

  const [loginErrorTextOpacity, setOpacity] = useState(new Animated.Value(1));

  const { login } = useContext(UserContext);

  /**
   * Converts Firebase error code into a helpful error message for the user
   * @returns error message
   */
  function translateErrorCodeToMessage() {
    if (loginErrorCode == "") return "";
    if (loginErrorCode == "auth/wrong-password")
      return "Wrong password! Please check again.";
    if (loginErrorCode == "auth/user-not-found")
      return "User not found! Please register for an account.";
    else return "Error! Please email the admin.";
  }

  /**
   * Wrapper function to allow user to login into the application
   * @param {string} msg 
   */
  function handleLogin(msg) {
    setOpacity(new Animated.Value(1));
    if (msg.loginError) {
      setLoginError(true);
      setLoginErrorCode(msg.loginErrorCode);
    } else {
      setLoginError(false);
      login(msg.uid, msg.profile);
      if (msg.profileError) navigate("Setup");
      else navigate("App");
    }
  }
  /**
   * Forces the error message to fade out eventually, over 2 seconds
   */
  useEffect(() => {
    Animated.timing(loginErrorTextOpacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [loginErrorTextOpacity]);

  return (
    <KeyboardAwareScrollView extraScrollHeight={70} enableOnAndroid={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Block style={{ flex: 3, marginTop: -10, marginLeft: -15 }}>
            <TouchableOpacity onPress={() => navigate("Onboarding")}>
              <Icon name="arrow-left" size={40}></Icon>
            </TouchableOpacity>
          </Block>

          <Block
            style={{
              flex: 12,
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={require("../assets/images/onboarding.png")}
              style={{
                height: 200,
                width: 200,
                alignSelf: "center",
                resizeMode: "contain",
                marginTop: -50,
              }}
            />
            <Text
              style={{
                alignSelf: "center",
                fontWeight: "800",
                fontSize: 40,
                marginTop: -50,
              }}
            >
              Welcome Back!
            </Text>
          </Block>

          <Block style={{ flex: 8, marginTop: 20 }}>
            <TouchableOpacity>
              <SocialIcon
                title="CONTINUE WITH FACEBOOK"
                button
                type="facebook"
                onPress={() => alert("sign in with facebook")}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <SocialIcon
                title="CONTINUE WITH GOOGLE"
                button
                type="google"
                onPress={() => alert("sign in with google")}
              />
            </TouchableOpacity>
          </Block>

          <Block
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 2,
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            <View>
              <Text style={{ width: 50, textAlign: "center" }}>OR</Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          </Block>

          <Block style={{ flex: 14 }}>
            <Input
              label="EMAIL ADDRESS"
              placeholder="Email"
              onChangeText={setEmail}
              leftIcon={<Icon name="mail" size={20} />}
            />

            <Input
              placeholder="Password"
              label="PASSWORD"
              secureTextEntry={true}
              onChangeText={setPassword}
              leftIcon={<Icon name="lock" size={20} />}
            />

            <View
              style={{
                marginTop: -25,
                marginBottom: 20,
                marginRight: 8,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity onPress={() => alert("Yo")}>
                <Text style={{ color: "#ff9900" }}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              style={{ alignSelf: "center", width: 200 }}
              fontWeight="bold"
              color="#03adfc"
              onPress={() => {
                EmailLoginHandler(email, password).then((response) =>
                  handleLogin(response)
                );
              }}
            >
              LOGIN
            </Button>

            {loginError ? (
              <Animated.Text
                style={{
                  opacity: loginErrorTextOpacity,
                  alignSelf: "center",
                  color: "red",
                }}
              >
                {translateErrorCodeToMessage()}
              </Animated.Text>
            ) : (
              <Text style={{ alignSelf: "center", color: "black" }}>
                
              </Text>
            )}
            {/* <Button onPress={clearAsyncStorage}>
              <Text>Clear Async Storage</Text>
            </Button> */}
          </Block>

          {/* https://stackoverflow.com/questions/42831685/disable-back-button-in-react-navigation */}
          {/* Use the following line for production (To remove the back button) */}
          {/* <TouchableHighlight onPress={() => this.props.navigation.replace('Home')}> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 24,
    flex: 1,
  },
});
