import React, { useEffect, useReducer, useState } from 'react' 
import {
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  View,
  SafeAreaView,
  FlatList
} from 'react-native'
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from 'expo-router';

import { styles, gradientColor, getUserType } from '@/constants/styles';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { NavigationButton } from '@/components/nav-button';

import whiteBox from '@/assets/images/white-box.png';
import homeIcon from '@/assets/images/home.png';
import react8 from '@/assets/images/reaction8.png';
import react7 from '@/assets/images/reaction7.png';
import react6 from '@/assets/images/reaction6.png';
import react5 from '@/assets/images/reaction5.png';
import react4 from '@/assets/images/reaction4.png';
import react3 from '@/assets/images/reaction3.png';
import react2 from '@/assets/images/reaction2.png';
import react1 from '@/assets/images/reaction1.png';
import CustomHeader from '@/components/header';
import BackButton from '@/components/back-button';

var taskList: any[] = [];
var doneTasks: any[] = []
var averageMood = 0;
const moodList = [react1, react2, react3, react4, react5, react6, react7, react8];

const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const progress = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const params = useLocalSearchParams<{uid: string}>();
  const uid = params.uid;

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();

  const [remarks, setRemarks] = useState<any>([])
  
  useEffect(() => {
    fetchTaskInfo();
    fetchReminders();
  }, [user])

  const fetchTaskInfo = async () => {
    taskList = [];
    doneTasks = [];

    const docRef = collection(db, "users", `${uid}`, "tasks");
    const data = await getDocs(docRef);
    const temp = data.docs.map((doc) => ({ ...doc.data() }));

    const dateToday = getDateToday();
    for (let item of temp) {
      if (item["dates"].includes(dateToday)) {
        taskList.push(item);
        if (item["doneDates"].includes(dateToday))
          doneTasks.push(item);
      }
    }

    let total = 0;
    for (let item of doneTasks) 
      total += item["patientRating"];

    averageMood = Math.floor(total/doneTasks.length) - 1;
    forceUpdate();
  }

  const fetchReminders = async () => {
    const remindersCollection = collection(db, `users/${uid}/reminders`);
    const q = query(remindersCollection, where('createdAt', '==', getDateToday()));
    const data = await getDocs(q);
    setRemarks(data.docs.map((doc) => ({ ...doc.data() })));
  }

  const renderRemarkItem = (item: any) => {
    return (
      <Text style={{ fontSize: 18 }}>
        {`\u2022 ${item.item.remark}`}
      </Text> 
    )
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <CustomHeader
        leftChildren={<BackButton/>}
        centerChildren={<Text style={styles.headerStyle}>Progress</Text>}
      />

      <SafeAreaView style={styles.contentContainer}>
        <ImageBackground
          style={tabStyles.therapistRemarksContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Therapy Session Remarks</Text>
          <View style={{ flex: 0.9, marginTop: 10, marginHorizontal: 20 }}>
            {remarks.length != 0 && (
              <FlatList
                data={remarks}
                renderItem={renderRemarkItem}
              />
            )}
            {remarks.length == 0 && (
              <Text style={{ alignSelf: "center", marginTop: 20 }}>Nothing to see here!</Text>
            )}
          </View>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.statisticsContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Task Completion</Text>
          <SafeAreaView style={tabStyles.statisticsSubcontainer}>
            <View style={tabStyles.statisticsDataContainer}>
              <Image source={moodList[averageMood]}/>
              <Text style={{
                fontSize: 16,
                marginTop: -3,
                fontWeight: "bold",
                textAlign: "center",
              }}>
                Average{"\n"}Mood Rating
              </Text>
            </View>
            <View style={tabStyles.statisticsDataContainer}>
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>
                {doneTasks.length} / {taskList.length}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}>
                Accomplished{"\n"}Daily Tasks
              </Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </SafeAreaView>

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
    marginTop: 10,
    fontWeight: "bold",
    alignSelf: "center"
  },
  therapistRemarksContainer: {
    flex: 0.35,
    marginHorizontal: 20, 
    marginVertical: 10,
    borderRadius: 30,
    overflow: "hidden"
  },
  statisticsContainer: {
    flex: 0.6,
    marginHorizontal: 20, 
    marginVertical: 10,
    borderRadius: 30,
    overflow: "hidden"
  },
  statisticsSubcontainer: {
    flex: 1,
    flexDirection: "row",
  },
  statisticsDataContainer: {
    flex: 1,
    paddingBottom: 30,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  moodContainer: {
    height: 100,
    width: "90%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden"
  }
});

export default progress