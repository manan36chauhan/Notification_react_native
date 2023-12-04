import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import SplashScreen from "react-native-splash-screen"; //import SplashScreen
import AppNav from "./src/Navigation/AppNav";
import { ApplicationStyles } from "./src/Themes";
import firestore from "@react-native-firebase/firestore";
import { Platform } from "react-native";
import NetworkLogger, {
  ThemeName,
  getBackHandler,
  startNetworkLogging,
} from "react-native-network-logger";
import NoConnection from "./src/ComponentReuse/NoConnection.js";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


import messaging from "@react-native-firebase/messaging";

import {
  getToken,
  notificationListner,
  requestUserPermission,
 
} from "./src/Screens/Notification/CommonUtils";

import DeviceInfo from "react-native-device-info";
async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  // const userId = auth().currentUser.uid;
  const userId = "Fcmtokens";
  // Add the token to the users datastore
  await firestore()
    .collection("Notifications")
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });

    
}

const App = () => {
  let deviceJson = {};

  deviceJson.deviceId = DeviceInfo.getDeviceId();
  deviceJson.uniqueId = DeviceInfo.getUniqueId();
  deviceJson.brand = DeviceInfo.getBrand();
  console.log(
    "device unique id ------>" + JSON.stringify(deviceJson, null, "")
  );

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:

    if (Platform.OS == "ios") {
      messaging()
        .getAPNSToken()
        .then((token) => {
          return saveTokenToDatabase(token);
        });
    }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
    startNetworkLogging();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({});
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("Gen notification ", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    //notificationListner();
    getToken();
  
  }, []);

  return (
    <>
      <View style={ApplicationStyles.app_container}>
        <NoConnection />
        <StatusBar backgroundColor="#ffff" barStyle="dark-content" />
        <AppNav />
      </View>
    </>
  );
};

export default App;
