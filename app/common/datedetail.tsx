import React, { useEffect, useState } from 'react'
import {
  Text,
  SafeAreaView,
  ImageBackground,
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Pressable
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';
import calendarIcon from '@/assets/images/calendar.png';
import whiteBox from '@/assets/images/white-box.png';

var taskInfo: any;

const getDateToday = () => {
  return new Date().toISOString().split("T")[0];
}

const datedetail = () => {
  const params = useLocalSearchParams<{uid: string, taskName: string}>();
  const uid = params.uid;
  const taskName = params.taskName;

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();
  const remindersCollection = collection(db, `users/${uid}/reminders`);

  const [remarks, setRemarks] = useState("");
  const [taskData, setTaskData] = useState<any>({});

  useEffect(() => {
    fetchTaskInfo();
  }, [user]);

  const fetchTaskInfo = async () => {
    const data = await getDocs(remindersCollection);
    taskInfo = data.docs.map((doc) => ({ ...doc.data() }));
  }

  const setTaskInfo = async () => {
    await setDoc(doc(remindersCollection, getDateToday()), {
      
    })
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Schedule</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <ImageBackground
          style={tabStyles.tasksContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>
            {new Date().toDateString().split(" ")[1]} {new Date().getDate()} Tasks
          </Text>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.remarksContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Remarks</Text>
          {userType == "therapist" && (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.85 }}>
                {/* <FlatList/> */}
                <Text>HI</Text>
              </View>
              <View style={{ flex: 0.15, alignItems: "center", justifyContent: "center" }}>
                <Pressable>
                  <Text style={tabStyles.addRemarkButton}>+</Text>
                </Pressable>
              </View>
            </View>
            // <TextInput
            //   style={{ marginLeft: 10 }}
            //   placeholder='Remarks'
            //   value={remarks}
            //   onChangeText={setRemarks}
            // />
          )}
          {userType == "patient" && (
            <Text>insert remarks here</Text>
          )}
        </ImageBackground>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
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
      </View>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  addRemarkButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    fontSize: 40,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  containerHeader: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center"
  },
  tasksContainer: {
    flex: 0.35,
    padding: 10,
    marginTop: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  remarksContainer: {
    flex: 0.4,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: "hidden"
  }
});

export default datedetail 