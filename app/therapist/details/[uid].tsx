import React, { useEffect, useState } from 'react'
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  ImageBackground,
  StyleSheet
} from 'react-native'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Agenda, AgendaSchedule } from 'react-native-calendars'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';
import progressIcon from '@/assets/images/graph.png';
import editIcon from '@/assets/images/edit.png';
import whiteBox from '@/assets/images/white-box.png';

const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const patientdetail = () => {
  const { uid } = useLocalSearchParams();

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [patientData, setPatientData] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [calendarItems, setCalendarItems] = useState<any>({});

  useEffect(() => {
    fetchPatientData();
    fetchTaskData();
  }, [user]);

  const fetchPatientData = async () => {
    const docRef = doc(db, "users", `${uid}`);
    const data = await getDoc(docRef);
    setPatientData(data.data());
  }

  const fetchTaskData = async () => {
    const docRef = collection(db, "users", `${uid}`, "tasks");
    const q = query(docRef, where("dates", "!=", null));
    const data = await getDocs(q);
    setTasks(data.docs.map((doc) => ({ ...doc.data() })));
    getTaskList();
  }

  const getTaskList = () => {
    let dates: AgendaSchedule = {};

    setTimeout(() => {
      for (let data of tasks) {
        for (let date of data["dates"]) {
          if (!dates[date])
            dates[date] = [{"name": data["name"], "height": 0, "day": ""}];
          else
            dates[date].push({"name": data["name"], "height": 0, "day": ""});
        }
      }
      setCalendarItems(dates);
    }, 10);
  }

  const renderEmptyDate = () => {
    return (
      <View style={{ height: 15, flex: 1, paddingTop: 30 }}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const renderItem = (item: any) => {
    return (
      <Pressable onPress={() => {router.push({ pathname: "/common/datedetail", params: {uid: uid, taskName: item.name}})}}>
        <ImageBackground 
          source={whiteBox}
          style={calendarStyles.taskContainer}
        >
          <View>
            <Text style={{ marginHorizontal: 20, fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>{patientData.firstName} {patientData.lastName}</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <View style={calendarStyles.calendarContainer}>
          <Agenda
            items={calendarItems}
            loadItemsForMonth={getTaskList}
            selected={getDateToday()}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            showClosingKnob={true}
            pastScrollRange={3}
            futureScrollRange={6}
            showOnlySelectedDayItems={true}
            renderEmptyData={() => {
              return <View style={{ alignItems: "center", marginTop: 10 }}><Text>
                Nothing to see here!
              </Text></View>
            }}
          />
        </View>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={"therapist/home"}
        />
        <NavigationButton 
          name={'Progress'}
          icon={progressIcon}
          navTo={{ pathname: `/common/progress`, params: {uid: uid}}}
        />
        <NavigationButton 
          name={'New Activity'}
          icon={editIcon}
          navTo={`/therapist/newactivity/${uid}`}
        />
      </View>
    </LinearGradient>
  )
}

const calendarStyles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    overflow: "hidden"
  },
  taskContainer: {
    height: 80,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden"
  }
});

export default patientdetail