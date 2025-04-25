import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, ImageBackground, TextInput, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';
import calendarIcon from '@/assets/images/calendar.png';
import whiteBox from '@/assets/images/white-box.png';

const datedetail = () => {
  const params = useLocalSearchParams<{uid: string, taskName: string}>();
  const uid = params.uid;
  const taskName = params.taskName;

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();

  const [remarks, setRemarks] = useState("");
  const [taskData, setTaskData] = useState<any>({});

  useEffect(() => {
    fetchTaskInfo();
  }, [user]);

  const fetchTaskInfo = async () => {
    const docRef = doc(db, `users/${uid}/tasks/${taskName}`);
    const data = await getDoc(docRef);
    setTaskData(data.data());
    console.log("ass", taskData);
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <SafeAreaView style={styles.contentContainer} className=''>
        <Text style={styles.headerStyle}>Schedule</Text>
        <ImageBackground
          style={tabStyles.tasksContainer}
          source={whiteBox}
        >
          <Text>{taskName}</Text>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.tasksContainer}
          source={whiteBox}
        >
          <TextInput
            style={{ marginLeft: 10 }}
            placeholder='Remarks'
            value={remarks}
            onChangeText={setRemarks}
          />
        </ImageBackground>
      </SafeAreaView>
      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
        <NavigationButton 
          isNavButton={false}
          name={'Schedule'}
          icon={calendarIcon}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  tasksContainer: {
    height: 100,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  }
});

export default datedetail 