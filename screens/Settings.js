import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Switch, StyleSheet, Dimensions, Alert } from "react-native";
import { Text, Card, Button } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from '../context/UserContext';
import {
  registerForPushNotificationsAsync,
  getEatNotifId,
  getExerciseNotifId,
  scheduleEatPushNotification,
  scheduleExercisePushNotification,
  cancelPushNotificationsById,
} from "../controller/NotifManager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Settings({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isEatNotif, setIsEatNotif] = useState(false);
  const [isExerNotif, setIsExerNotif] = useState(false);
  const {logout} = useContext(UserContext);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    /**
     * Sets the eat-notification if not set
     */
    async function isEatNotifsSet() {
      const eatNotifId = await getEatNotifId();
      if (eatNotifId !== null) {
        setIsEatNotif(true);
      } else {
        setIsEatNotif(false);
      }
    }

    /**
     * Sets the exercise-notification if not set
     */
    async function isExerciseNotifsSet() {
      const exerciseNotifId = await getExerciseNotifId();
      if (exerciseNotifId !== null) {
        setIsExerNotif(true);
      } else {
        setIsExerNotif(false);
      }
    }

    isEatNotifsSet();
    isExerciseNotifsSet();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const toggleSwitchEat = async () => {
    if (isEatNotif === false) {
      let notif = await scheduleEatPushNotification();
      alert("Eat healthily notifications set");
    } else {
      const eatNotifId = await getEatNotifId();
      console.log(eatNotifId);
      await cancelPushNotificationsById(eatNotifId);
      alert("Cancelled eat healthily notifications");
    }
    setIsEatNotif((previousState) => !previousState);
  };

  const toggleSwitchExer = async () => {
    if (isExerNotif === false) {
      let notif = await scheduleExercisePushNotification();
      alert("Exercise notifications set");
    } else {
      const exerciseNotifId = await getExerciseNotifId();
      console.log(exerciseNotifId);
      await cancelPushNotificationsById(exerciseNotifId);
      alert("Cancelled exercise notifications");
    }
    setIsExerNotif((previousState) => !previousState);
  };

  const backActionHandler = () => {
    Alert.alert("Alert!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", 
      onPress: () => {
        navigation.navigate("Onboarding");
        logout();
      }}
    ]);
    return true;
  };

  return (
    <LinearGradient
      colors={["transparent", "#FFD789"]}
      start={{ x: 0.1, y: 0.1 }}
      style={styles.linearGradient}
    >
      <View style={styles.cardView}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.text}>Notifications</Text>
          <Card style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 5,
                paddingBottom: 15,
                paddingLeft: 35,
              }}
            >
              <Text style={styles.textCard}>Eat healthy notifications</Text>
              <Switch
                style={{ paddingLeft: 33 }}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEatNotif ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchEat}
                value={isEatNotif}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 15,
                paddingLeft: 35,
              }}
            >
              <Text style={styles.textCard}>Exercise notifications</Text>
              <Switch
                style={{ paddingLeft: 50 }}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isExerNotif ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchExer}
                value={isExerNotif}
              />
            </View>
          </Card>
          <Text style={styles.text}>Account</Text>
          <Card style={styles.cardButton}>
            <Button
              style={{
                alignSelf: "center",
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").height * 0.048,
              }}
              title="Change password"
              onPress={() => {
                alert("Change password");
              }}
              color="#BD55EB"
            >
              Change Password
            </Button>
            <Button
              style={{
                alignSelf: "center",
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").height * 0.048,
              }}
              title="Log Out"
              onPress={backActionHandler}
              color="#FF5570"
            >
              Log Out
            </Button>
          </Card>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.2,
    borderBottomColor: "grey",
    borderRightColor: "grey",
    backgroundColor: "white",
    flexDirection: "column",
    //alignItems: "center",
    //justifyContent: "space-around",
    //padding: 10,
    borderRadius: 20,
    paddingBottom: 50,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
  cardButton: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.2,
    borderBottomColor: "grey",
    borderRightColor: "grey",
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 20,
    paddingBottom: 22,
  },
  cardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 200,
  },
  text: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingLeft: 10,
    lineHeight: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
  textCard: {
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
  },
});
