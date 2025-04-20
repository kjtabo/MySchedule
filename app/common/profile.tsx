import React from 'react';
import { Text, SafeAreaView, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from '@firebase/auth';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { styles, gradientColor, getUserType } from '@/constants/styles';
import whiteBox from '@/assets/images/white-box.png';
import homeIcon from '@/assets/images/home.png';
import { NavigationButton } from '@/components/nav-button';

const profile = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const userType = getUserType();
  
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/common/login");
  });

  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";

  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
      >
      <Text style={styles.headerStyle}>Profile</Text>

      <ImageBackground
        style={tabStyles.profileContainer}
        source={whiteBox}
      >
        <Text>Hi</Text>
      </ImageBackground>

      <Pressable onPress={() => {router.push("/common/patientthererapistrequest")}}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>Add a {userCounterpart}</Text>
        </ImageBackground>
      </Pressable>

      <Pressable onPress={() => {router.push("/common/chat")}}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>Message</Text>
        </ImageBackground>
      </Pressable>

      <Pressable onPress={() => {router.push("/common/settings")}}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>App Settings</Text>
        </ImageBackground>
      </Pressable>

      <Pressable onPress={() => {router.push("/common/about")}}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>About the app</Text>
        </ImageBackground>
      </Pressable>

      <Pressable onPress={() => {auth.signOut()}}>
        <ImageBackground
          style={tabStyles.logOutContainer}
          source={whiteBox}
        >
          <Text>Log out</Text>
        </ImageBackground>
      </Pressable>

      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton
          name={"Home"}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  profileContainer: {
    height: 300,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  buttonContainer: {
    height: 50,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  logOutContainer: {
    height: 50,
    marginTop: 5,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  }
});

export default profile 