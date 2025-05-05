import React, { useEffect, useReducer, useState } from 'react'
import {
  ImageBackground,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  View
} from 'react-native'
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from 'expo-router';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { styles, gradientColor } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import whiteBox from '@/assets/images/white-box.png';
import progressIcon from '@/assets/images/graph.png';
import calendarIcon from '@/assets/images/calendar.png';
import profileIcon from '@/assets/images/person.png';

var taskData: any[] = [];
var taskReminders: any[] = [];

type ItemData = {
  name: string,
  details: string,
  from: string,
  doneDates: string[],
  dates: string[],
  deadline?: any 
}

const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const home = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [hasReminders, setHasReminders] = useState(false);

  useEffect(() => {
    fetchTaskData();
  }, [user]);
  
  const fetchTaskData = async () => {
    const docRef = collection(db, "users", `${user?.uid}`, "tasks");
    const q = query(docRef, where("dates", "!=", null));
    const data = await getDocs(q);

    const temp = data.docs.map((doc) => ({ ...doc.data() }));
    const dateToday = new Date().toISOString().split("T")[0];
    taskData = [];
    taskReminders = [];
    
    for (let task of temp) {
      if (task["dates"].includes(dateToday))
        taskData.push(task);
      if ("deadline" in task && (task["deadline"] != '')) {
        setHasReminders(true);
        taskReminders.push(task);
      }
    }

    forceUpdate();
  }

  const renderTaskItem = ({item} : {item: ItemData}) => {
    return (
      <Link 
        style={{
          ...tabStyles.taskItem,
          textDecorationLine: item.doneDates.includes(getDateToday()) ? "line-through" : "none"
        }}
        href={{
          pathname: "/patient/taskdetail", params: {
            uid: user?.uid,
            taskName: item.name,
            details: item.details,
            doneDates: JSON.stringify(item.doneDates)
          }
        }}
        disabled={item.doneDates.includes(getDateToday())}
      >
        {`\u2022 ${item.name}`}
      </Link>
    )
  }

  const renderReminderItem = ({item} : {item: ItemData}) => {
    if (item.deadline.seconds < 60)
      return <View/>

    const deadline = new Date(item.deadline.seconds)
    deadline.setHours(deadline.getHours() + 12);
    
    const timeString = deadline.toLocaleTimeString();
    const ampm = deadline.getHours() >= 12 ? "PM" : "AM";
    return (
      <Text style={{ 
        fontSize: 18,
        textDecorationLine: item.doneDates.includes(getDateToday()) ? "line-through" : "none" 
      }}>
        {`\u2022 Accomplish ${item.name} by ${`${timeString.split(":")[0]}:${timeString.split(":")[1]} ${ampm}`}`}
      </Text> 
    )
  }

  return (
    <LinearGradient
    style={styles.backgroundContainer}
    colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Today's Tasks</Text>
      </View>

      <SafeAreaView style={styles.homeContainer}>
        <SafeAreaView style={tabStyles.tasksContainer}>
          <FlatList
            data={taskData}
            renderItem={renderTaskItem}
          />
        </SafeAreaView>
        <ImageBackground
          style={tabStyles.remindersContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Reminders</Text>
          {hasReminders && (
            <FlatList
              data={taskData}
              renderItem={renderReminderItem}
            />
          )}
          {!hasReminders && (
            <Text style={{ alignSelf: "center", marginTop: 20 }}>Nothing to see here!</Text>
          )}
        </ImageBackground>
      </SafeAreaView>
      
      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Schedule'}
          icon={calendarIcon}
          navTo={'/patient/schedule'}
        />
        <NavigationButton 
          name={'Progress'}
          icon={progressIcon}
          navTo={{ pathname: `/common/progress`, params: {uid: user?.uid}}}
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
  containerHeader: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center"
  },
  taskItem: {
    fontSize: 30,
    paddingInline: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  tasksContainer: {
    flex: 0.45,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center" 
  },
  remindersContainer: {
    flex: 0.45,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  }
});

export default home