import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';

import { styles, gradientColor } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';

import notifsIcon from '@/assets/images/bell.png';
import profileIcon from '@/assets/images/person.png';
import whiteBox from '@/assets/images/white-box.png';

type ItemData = {
  displayName: string,
  uid: string
}

const home = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  
  const user = auth.currentUser; 
  const patientsCollection = collection(db, `/users/${user?.uid}/patients`);
  
  const [patients, setPatients] = useState<any>([]);
  
  useEffect(() => {
    fetchPatients();
  }, [user]);
  
  const fetchPatients = async () => {
    if (user) {
      const data = await getDocs(patientsCollection);
      setPatients(data.docs.map((doc) => ({ ...doc.data() })));
    }
  }
  
  const renderItem = ({item}: {item: ItemData}) => {
    return (
      <Pressable onPress={() => {router.push({pathname: `/therapist/details`, params: {uid: item.uid}})}}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
          >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.displayName}</Text>
        </ImageBackground>
      </Pressable>
    )
  }
  
  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Patient Carryover</Text>
      </View>

      <SafeAreaView style={styles.homeContainer}>
        <FlatList
          data={patients}
          renderItem={renderItem}
        />
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Notifications'}
          icon={notifsIcon}
          navTo={'/therapist/notifs'}
        />
        <NavigationButton 
          name={'Profile'}
          icon={profileIcon}
          navTo={'/common/profile'}
        />
      </View>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  buttonContainer: {
    height: 80,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: "center",
    overflow: "hidden"
  }
});

export default home