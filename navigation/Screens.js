import React, { useEffect, useContext } from 'react';
import { Dimensions, BackHandler, Alert } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';
import SetupScreen from '../screens/Setup';
import ProfileScreen from '../screens/Profile';
import EditProfileScreen from '../screens/EditProfile';
import SettingsScreen from '../screens/Settings';
import CaloriesScreen from '../screens/Calories';
import LocationScreen from '../screens/Location';
import HobbiesChatroomScreen from '../screens/HobbiesChatMenu';
import LocationChatroomScreen from '../screens/LocationChatMenu';
import HobbiesChatScreen from '../screens/HobbiesChat'
import LocationChatScreen from '../screens/LocationChat'


import CustomDrawerContent from './Menu';
import { Icon, Header } from '../components';
import { Images, materialTheme } from "../constants/";
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
              black 
              transparent 
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              black 
              transparent 
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
      />
    </Stack.Navigator>
  );
}

function CaloriesStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Calories"
        component={CaloriesScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Calories" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function LocationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Location" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function ChatroomTab(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen 
      name="Hobbies"
      component={HobbiesChatroomScreen}
      />
      <Tab.Screen 
        name="Location"
        component={LocationChatroomScreen}
      />
  </Tab.Navigator>    
  );
}

function ChatroomStack(props) {
  return(
    <Stack.Navigator
      initialRouteName="Chatroom"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Chatroom"
        component={ChatroomTab}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Chatrooms" scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen 
        name="HobbiesChat"
        component={HobbiesChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
            back 
            black 
            transparent 
            title="Chat" 
            navigation={navigation} 
            scene={scene} />
          ),
          headerTransparent: false
        }}
      />
      <Stack.Screen 
        name="LocationChat"
        component={LocationChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
            back 
            black 
            transparent 
            title="Chat" 
            navigation={navigation} 
            scene={scene} />
          ),
          headerTransparent: false
        }}
      />
    </Stack.Navigator>
  )
}


function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}


function AppStack({navigation}) {

  const {logout} = useContext(UserContext)

  //Disable back button in Main app
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

  useEffect(() => {
    // Add event listener for hardware back button press on Android
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      // clear/remove event listener
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

  const {profile} = useContext(UserContext)

  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => (
        <CustomDrawerContent {...props} profile={{...profile, ...{avatar:Images.Profile}}} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
      />
      <Drawer.Screen
        name="Calories"
        component={CaloriesStack}
      />
      <Drawer.Screen
        name="Location"
        component={LocationStack}
      />
      <Drawer.Screen
        name="Chatroom"
        component={ChatroomStack}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen
         name="Login"
         component={LoginScreen}
     />
     <Stack.Screen
         name="SignUp"
         component={SignUpScreen}
     />
     <Stack.Screen
         name="Setup"
         component={SetupScreen}
     />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}