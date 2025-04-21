import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';
import progressIcon from '@/assets/images/graph.png';
import editIcon from '@/assets/images/edit.png';
import Calendar from '@/components/calendar'

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
  const [calendarItems, setCalendarItems] = useState<any>({});

  console.log(getDateToday());

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    const docRef = doc(db, "users", `${uid}`);
    const data = await getDoc(docRef);
    setPatientData(data.data());
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <SafeAreaView style={styles.contentContainer}>
        <Text style={styles.headerStyle}>{patientData.firstName} {patientData.lastName}</Text>
        <Calendar data={{uid: uid}}/> 
      </SafeAreaView>
      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={"therapist/home"}
        />
        <NavigationButton 
          name={'Progress'}
          icon={progressIcon}
          navTo={`/therapist/progress/${uid}`}
        />
        <NavigationButton 
          name={'New Activity'}
          icon={editIcon}
          navTo={`/therapist/newactivity/${uid}`}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default patientdetail