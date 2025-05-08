import React, { useEffect, useReducer, useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Pressable,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { Href, router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from 'firebase/auth';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { styles, gradientColor, getUserType } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';

import whiteBox from '@/assets/images/white-box.png';
import homeIcon from '@/assets/images/home.png';
import Modal from 'react-native-modal';
import CustomHeader from '@/components/header';
import BackButton from '@/components/back-button';

var userData: any;
var patientNumber: number;
var therapistList: any[];

const profile = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();
  
  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [isModalVisible, setModalVisible] = useState(false);
  
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/common/login");
  });
    
  useEffect(() => {
    fetchUserInfo();
    if (userType == "therapist")
      fetchPatientInfo();
    else if (userType == "patient")
      fetchTherapistInfo();
  }, [user]);

  const fetchUserInfo = async () => {
    const docRef = doc(db, "users", `${user?.uid}`);
    const data = await getDoc(docRef);
    userData = data.data();
    forceUpdate();
  }

  const fetchPatientInfo = async () => {
    const docRef = collection(db, "users", `${user?.uid}`, "patients");
    const data = await getDocs(docRef);
    patientNumber = data.docs.map((doc) => ({ ...doc.data() })).length;
  }

  const fetchTherapistInfo = async () => {
    const docRef = collection(db, "users", `${user?.uid}`, "therapists");
    const data = await getDocs(docRef);
    therapistList = data.docs.map((doc) => ({ ...doc.data() }));
  }

  const renderItem = (data: any) => {
    return <Text style={{ marginLeft: 10, fontSize: 18}}>{`\u2022 ${data.item.displayName}`}</Text>
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <CustomHeader
        leftChildren={<BackButton/>}
        centerChildren={<Text style={styles.headerStyle}>Profile</Text>}
      />

      <SafeAreaView style={styles.contentContainer}>

        <ImageBackground
          style={tabStyles.profileContainer}
          source={whiteBox}
        >
          {userType === "patient" && (
            <SafeAreaView>
              <Text style={tabStyles.containerHeader}>Patient</Text>
              <Text style={tabStyles.profileText}>Name:  {userData?.firstName} {userData?.lastName}</Text>
              <Text style={tabStyles.profileText}>Conditions:  {userData?.conditions}</Text>
              <Text style={tabStyles.profileText}>Name of Therapist:  </Text>
              <FlatList
                data={therapistList}
                renderItem={renderItem}
              />
            </SafeAreaView>
          )}

          {userType === "therapist" && (
            <SafeAreaView>
              <Text style={tabStyles.containerHeader}>Occupational Therapist</Text>
              <Text style={tabStyles.profileText}>Name:  {userData?.firstName} {userData?.lastName}</Text>
              <Text style={tabStyles.profileText}>Number of Patients:  {patientNumber}</Text>
            </SafeAreaView>
          )}
        </ImageBackground>

        <TouchableOpacity activeOpacity={0.7} onPress={() => {router.push("/common/patientthererapistrequest")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>Add a {userCounterpart}</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => {router.push("/common/chatlanding" as Href)}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>Message</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* <Pressable onPress={() => {router.push("/common/settings")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>App Settings</Text>
          </ImageBackground>
        </Pressable> */}

        <TouchableOpacity activeOpacity={0.7} onPress={() => {router.push("/common/about")}}>
          <ImageBackground
            style={tabStyles.buttonContainer}
            source={whiteBox}
          >
            <Text style={tabStyles.buttonText}>About the app</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => {setModalVisible(true)}}>
          <ImageBackground
            style={tabStyles.logOutContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Log out</Text>
          </ImageBackground>
        </TouchableOpacity>
      </SafeAreaView>

      <Modal isVisible={isModalVisible}>
        <SafeAreaView>
          <ImageBackground
            style={tabStyles.modalContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Do you wish to log out?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => auth.signOut()}>
              <ImageBackground
                style={tabStyles.modalButtons}
                source={whiteBox}
                tintColor={"#EDEDED"}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Log out</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(false)}>
              <ImageBackground
                style={tabStyles.modalButtons}
                source={whiteBox}
                tintColor={"#EDEDED"}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
              </ImageBackground>
            </TouchableOpacity>
          </ImageBackground>
        </SafeAreaView>
      </Modal>

      <View style={styles.navButtonContainer}>
        <NavigationButton
          name={"Home"}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </View>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  containerHeader: {
    fontSize: 25,
    marginBottom: 15,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "capitalize"
  },
  profileText: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    textTransform: "capitalize"
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
    padding: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  buttonContainer: {
    height: 50,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  logOutContainer: {
    height: 50,
    marginTop: 15,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  modalContainer: {
    height: 150,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  modalButtons: {
    height: 35,
    width: 200,
    marginVertical: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
});

export default profile 