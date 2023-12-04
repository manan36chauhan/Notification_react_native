import React, { useState, useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export async function requestUserPermission() {

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    return 1
  }
  return 0
}




export const getToken = async () => {
  // await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();

  console.log("pizzaiolo device token--->", token);
  
  // save the token to the db
};
