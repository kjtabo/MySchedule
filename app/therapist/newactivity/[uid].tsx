import React, { useEffect, useState } from 'react'
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { gradientColor, styles } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';

const newactivity = () => {
  const { uid } = useLocalSearchParams();
  
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [patientData, setPatientData] = useState<any>([]);
  const [calendarItems, setCalendarItems] = useState<any>({});

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    const docRef = doc(db, "users", `${uid}`);
    const data = await getDoc(docRef);
    setPatientData(data.data());
  }

  const submitActivity = async () => {
    const patientTasksCollection = collection(db, `/users/${uid}/tasks`);
    await setDoc(doc(patientTasksCollection, activityDate), {
      from: user?.uid,
      name: activityName,
    });
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <SafeAreaView style={styles.contentContainer}>
        <Text style={styles.headerStyle}>{patientData.firstName} {patientData.lastName}</Text>

        <ImageBackground
          style={tabStyles.nameContainer}
          source={whiteBox}
        >
          <TextInput 
            style={{ marginLeft: 10 }}
            placeholder='Activity'
            value={activityName}
            onChangeText={setActivityName}
          />
        </ImageBackground>

        <ImageBackground
          style={tabStyles.detailsContainer}
          source={whiteBox}
        >
          <TextInput 
            style={{ marginLeft: 10 }}
            placeholder='Activity'
            value={activityName}
            onChangeText={setActivityName}
          />
        </ImageBackground>

        <ImageBackground
          style={tabStyles.setDateContainer}
          source={whiteBox}
        >
          <TextInput 
            style={{ marginLeft: 10 }}
            placeholder='Activity'
            value={activityName}
            onChangeText={setActivityName}
          />
        </ImageBackground>

        <ImageBackground
          style={tabStyles.setRepeatContainer}
          source={whiteBox}
        >
          <TextInput 
            style={{ marginLeft: 10 }}
            placeholder='Activity'
            value={activityName}
            onChangeText={setActivityName}
          />
        </ImageBackground>

        <Pressable onPress={() => {auth.signOut()}}>
          <ImageBackground
            style={tabStyles.logOutContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Save Task</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>
      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton
          name={'Home'}
          icon={homeIcon}
          navTo={"/therapist/home"}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  nameContainer: {
    height: 50,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  detailsContainer: {
    height: 150,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  setDateContainer: {
    height: 100,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
  setRepeatContainer: {
    height: 100,
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

export default newactivity