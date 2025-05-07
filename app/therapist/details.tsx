import React, { useEffect, useReducer, useState } from 'react'
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  ImageBackground,
  StyleSheet,
  FlatList
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
import CalendarPicker from 'react-native-calendar-picker'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'

import Entypo from '@expo/vector-icons/Entypo';
import homeIcon from '@/assets/images/home.png';
import progressIcon from '@/assets/images/graph.png';
import editIcon from '@/assets/images/edit.png';
import whiteBox from '@/assets/images/white-box.png';

var tasks: any = [];
const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const patientdetail = () => {
  const { uid } = useLocalSearchParams();

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [patientData, setPatientData] = useState<any>([]);
  const [calendarItems, setCalendarItems] = useState<any>({});
  const [activitiesToday, setActivitiesToday] = useState<any>({});
  const [hasActivities, setHasActivities] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  useEffect(() => {
    fetchPatientData();
    fetchTaskData();
  }, []);

  const fetchPatientData = async () => {
    const docRef = doc(db, "users", `${uid}`);
    const data = await getDoc(docRef);
    setPatientData(data.data());
  }

  const fetchTaskData = async () => {
    const docRef = collection(db, "users", `${uid}`, "tasks");
    const q = query(docRef, where("dates", "!=", null));
    const data = await getDocs(q);
    tasks = data.docs.map((doc) => ({ ...doc.data() }));
    getTaskList();
    forceUpdate();
  }

  const getTaskList = () => {
    let dates: any = {};

    for (let data of tasks) {
      for (let date of data["dates"]) {
        if (!(date in dates))
          dates[date] = [{"name": data["name"]}];
        else
          dates[date].push({"name": data["name"]});
      }
    }
    setCalendarItems(dates);
    updateActivitesToday(dateSelected);
  }

  const updateActivitesToday = (date: Date) => {
    setDateSelected(date);
    const dateSelected = date.toISOString().split("T")[0];
    if (dateSelected in calendarItems) {
      setHasActivities(true);
      setActivitiesToday(calendarItems[dateSelected]);
    }
    else setHasActivities(false);
  }

  const renderItem = (item: any) => {
    const selected = dateSelected.toISOString().split("T")[0]
    return (
      <Pressable onPress={() => {router.push({
          pathname: "/common/datedetail",
          params: {uid: uid, selectedDate: selected, dailyTasks: JSON.stringify(activitiesToday)}
        })}}
      >
        <ImageBackground 
          source={whiteBox}
          style={calendarStyles.taskContainer}
          tintColor={'skyblue'}
        >
          <Text style={{ marginHorizontal: 20, fontSize: 20, fontWeight: "bold" }}>{item.item.name}</Text>
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
        <Text style={{ ...styles.headerStyle, textTransform: "capitalize" }}>
          {patientData.firstName} {patientData.lastName}
        </Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <View style={calendarStyles.calendarContainer}>
          <View style={{ flex: 0.5, borderBottomColor: "#EDEDED", borderBottomWidth: 2 }}>
            <CalendarPicker 
              onDateChange={updateActivitesToday}
              scaleFactor={400}
              textStyle={{ fontSize: 20, fontWeight: "bold" }}
              selectedDayColor='dodgerblue'
              selectedDayTextColor='white'
              initialDate={new Date()}
              showDayStragglers={true}
              previousComponent={
                <Entypo
                  name="chevron-left"
                  size={24}
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              }
              nextComponent={
                <Entypo
                  name="chevron-right"
                  size={24}
                  color="black"
                  style={{ marginRight: 20 }} 
                />
              }
            />
          </View>
          <View style={{ flex: 0.5 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", marginLeft: 10, marginVertical: 10 }}>
              {dateSelected.toDateString()}
            </Text>
            {hasActivities && (
              <FlatList
                data={activitiesToday}
                renderItem={renderItem}
              />
            )}
            {!hasActivities && (
              <Text style={{ alignSelf: "center", marginTop: 20 }}>Nothing to see here!</Text>
            )}
          </View>
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
          navTo={{ pathname: `/common/progress`, params: {uid: uid} }}
        />
        <NavigationButton 
          name={'New Activity'}
          icon={editIcon}
          navTo={{ pathname: `/therapist/newactivity`, params: {uid: uid} }}
        />
      </View>
    </LinearGradient>
  )
}

const calendarStyles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: "white",
    overflow: "hidden"
  },
  taskContainer: {
    height: 50,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 5,
    resizeMode: "cover",
    justifyContent: "center",
    overflow: "hidden"
  }
});

export default patientdetail