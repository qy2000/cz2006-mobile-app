import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

/**
 * Updates the id of eat-notifications in AsyncStorage
 * @param {string} value 
 */
const storeEatNotifId = async (value) => {
  try {
    await AsyncStorage.setItem("@storage_Key", value);
    console.log("saved " + value);
  } catch (e) {
    // saving error
    console.log("write error");
  }
};

/**
 * Stores the id of exercise-notification into AsyncStorage
 * @param {string} value 
 */
const storeExerciseNotifId = async (value) => {
  try {
    await AsyncStorage.setItem("@storage_Key_exercise", value);
    console.log("saved " + value);
  } catch (e) {
    // saving error
    console.log("write error");
  }
};

/**
 * Reads the id of eat-notification from the AsyncStorage
 * @returns string
 */
export const getEatNotifId = async () => {
  try {
    const value = await AsyncStorage.getItem("@storage_Key");
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.log("read error");
    return null;
    // error reading value
  }
};

/**
 * Reads and returns the id of the exercise-notification
 * @returns string
 */
export const getExerciseNotifId = async () => {
  try {
    const value = await AsyncStorage.getItem("@storage_Key_exercise");
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.log("read error");
    return null;
    // error reading value
  }
};

/**
 * Set the time interval for eat-notification
 */
export const scheduleEatPushNotification = async () => {
  var notif = "";
  notif = await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Eat healthily. Consume a balanced diet and drink water regularly.",
      data: { data: "goes here" },
    },
    trigger: { seconds: 1000, repeats: true },
  });
  storeEatNotifId(notif);
};

/**
 * Set the time interval for exercise-notification
 */
export const scheduleExercisePushNotification = async () => {
  var notif = "";
  notif = await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Exercise regularly. Locate the nearest gym using BeFit.",
      data: { data: "goes here" },
    },
    trigger: { seconds: 1000, repeats: true },
  });
  storeExerciseNotifId(notif);
};

/**
 * Terminates the push notifications using their id
 * @param {string} identifier 
 */
export const cancelPushNotificationsById = async (identifier) => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

/**
 * Subscribes to the notification services
 * @returns 
 */
export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};
