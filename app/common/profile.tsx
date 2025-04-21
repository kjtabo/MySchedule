import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image
} from 'react-native';
import { router, Tabs } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from '@firebase/auth';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { styles, gradientColor, getUserType } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import whiteBox from '@/assets/images/white-box.png';
import arrow from '@/assets/images/arrow.png';
import homeIcon from '@/assets/images/home.png';

const profile = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const userType = getUserType();
  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";
  
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/common/login");
  });

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
      >
      <SafeAreaView style={styles.contentContainer}>
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
            <Text style={tabStyles.buttonText}>Add a {userCounterpart}</Text>
          </ImageBackground>
        </Pressable>

        <Pressable onPress={() => {router.push("/common/chat")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>Message</Text>
          </ImageBackground>
        </Pressable>

        <Pressable onPress={() => {router.push("/common/settings")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>App Settings</Text>
          </ImageBackground>
        </Pressable>

        <Pressable onPress={() => {router.push("/common/about")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>About the app</Text>
          </ImageBackground>
        </Pressable>

        <Pressable onPress={() => {auth.signOut()}}>
          <ImageBackground
            style={tabStyles.logOutContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Log out</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>
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
  profileText: {

  },
  buttonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold"
  },
  profileContainer: {
    height: 300,
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