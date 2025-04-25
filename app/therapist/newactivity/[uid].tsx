import React, { useEffect, useReducer, useState } from 'react'
import {
  Button,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { Href, router, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { gradientColor, styles } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';

const newactivity = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const { uid } = useLocalSearchParams();
  
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [activityName, setActivityName] = useState("");
  const [patientData, setPatientData] = useState<any>([]);
  const [taskDetails, setTaskDetails] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [startDateTitle, setStartDateTitle] = useState("set start date");
  const [endDateTitle, setEndDateTitle] = useState("set end date");
  const [isSelectStartOpen, setSelectStartOpen] = useState(false);
  const [isSelectEndOpen, setSelectEndOpen] = useState(false);

  const [isSelectedM, setSelectedM] = useState(false);
  const [isSelectedT, setSelectedT] = useState(false);
  const [isSelectedW, setSelectedW] = useState(false);
  const [isSelectedTh, setSelectedTh] = useState(false);
  const [isSelectedF, setSelectedF] = useState(false);
  const [isSelectedSa, setSelectedSa] = useState(false);
  const [isSelectedSu, setSelectedSu] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    const docRef = doc(db, "users", `${uid}`);
    const data = await getDoc(docRef);
    setPatientData(data.data());
  }

  const getDates = () => {
    const selectedDays = [isSelectedSu, isSelectedM, isSelectedT, isSelectedW, isSelectedTh, isSelectedF, isSelectedSa];
    let datesList = [];

    while (startDate.toISOString().split("T")[0] != endDate.toISOString().split("T")[0]) {
      const currentDate = startDate;

      if (selectedDays[currentDate.getDay()])
        datesList.push(currentDate.toISOString().split("T")[0]);
      
      startDate.setDate(startDate.getDate() + 1);
    }
    return datesList;
  }

  const getTint = (day: string) => {
    switch (day) {
      case "M":
        return isSelectedM ? "#C4C4C4" : "#EDEDED";
      case "T":
        return isSelectedT ? "#C4C4C4" : "#EDEDED";
      case "W":
        return isSelectedW ? "#C4C4C4" : "#EDEDED";
      case "Th":
        return isSelectedTh ? "#C4C4C4" : "#EDEDED";
      case "F":
        return isSelectedF ? "#C4C4C4" : "#EDEDED";
      case "Sa":
        return isSelectedSa ? "#C4C4C4" : "#EDEDED";
      case "Su":
        return isSelectedSu ? "#C4C4C4" : "#EDEDED";
      default:
        return "#FFFFFF";
    }
  }

  const onChangeStart = ({type} : {type: any}, selectedDate: any) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setStartDate(currentDate);

      if (Platform.OS === "android") {
        setStartDateTitle(currentDate.toDateString());
        setSelectStartOpen(false);
      }
    }
    else {
      setSelectEndOpen(false);
    }
  };
 
  const onChangeEnd = ({type}: {type: any}, selectedDate: any) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setEndDate(currentDate);

      if (Platform.OS === "android") {
        setEndDateTitle(currentDate.toDateString());
        setSelectEndOpen(false);
      }
    }
    else {
      setSelectEndOpen(false);
    }
  };

  const confirmStartIOS = () => {
    setStartDateTitle(startDate.toDateString());
    setSelectStartOpen(false);
  }

  const confirmEndIOS = () => {
    setEndDateTitle(endDate.toDateString());
    setSelectEndOpen(false);
  }
 
  const submitActivity = async () => {
    const dates = getDates();

    console.log(uid);
    const patientTasksCollection = collection(db, `/users/${uid}/tasks`);
    await setDoc(doc(patientTasksCollection, activityName), {
      from: user?.uid,
      name: activityName,
      details: taskDetails,
      dates: dates,
      isDone: false,
    });

    console.log("ass")
    router.replace(`/therapist/details/${uid}` as Href);
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <SafeAreaView style={styles.contentContainer}>
        <Text style={styles.headerStyle}>{patientData.firstName} {patientData.lastName}</Text>

        {/* Task Name */}
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

        {/* Task Details */}
        <ImageBackground
          style={tabStyles.detailsContainer}
          source={whiteBox}
        >
          <TextInput 
            style={{ marginLeft: 10 }}
            placeholder='Details'
            value={taskDetails}
            onChangeText={setTaskDetails}
          />
        </ImageBackground>

        {/* Set Start / End Date */}
        <ImageBackground
          style={tabStyles.setDateContainer}
          source={whiteBox}
        >
          <Button title={startDateTitle} onPress={() => setSelectStartOpen(true)}/>
          <Button title={endDateTitle} onPress={() => setSelectEndOpen(true)}/>
          {isSelectStartOpen && (
            <DateTimePicker
              mode='date'
              display='spinner'
              value={startDate}
              onChange={onChangeStart}
            />
          )}
          {isSelectStartOpen && Platform.OS === "ios" && (
            <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
              <Button title="cancel" onPress={() => setSelectStartOpen(false)}/>
              <Button title="submit" onPress={confirmStartIOS}/>
            </View>
          )} 
          {isSelectEndOpen && (
            <DateTimePicker
              mode='date'
              display='spinner'
              value={endDate}
              onChange={onChangeEnd}
            />
          )}
          {isSelectEndOpen && Platform.OS === "ios" && (
            <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
              <Button title="cancel" onPress={() => setSelectEndOpen(false)}/>
              <Button title="submit" onPress={confirmEndIOS}/>
            </View>
          )} 
        </ImageBackground>

        {/* Select Day Repeats */}
        <ImageBackground
          style={tabStyles.setRepeatContainer}
          source={whiteBox}
        >
          <Text style={{ marginLeft: 20, marginTop: 13 }}>Select Days</Text>
          <View style={tabStyles.selectableDayContainer}>
            {/* Monday */}
            <Pressable
              onPressIn={() => {
                setSelectedM(!isSelectedM);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("M")}
              >
                <Text>M</Text>
              </ImageBackground>
            </Pressable>
            
            {/* Tuesday */}
            <Pressable
              onPressIn={() => {
                setSelectedT(!isSelectedT);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("T")}
              >
                <Text>T</Text>
              </ImageBackground>
            </Pressable>

            {/* Wednesday */}
            <Pressable
              onPressIn={() => {
                setSelectedW(!isSelectedW);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("W")}
              >
                <Text>W</Text>
              </ImageBackground>
            </Pressable>

            {/* Thursday */}
            <Pressable
              onPressIn={() => {
                setSelectedTh(!isSelectedTh);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("Th")}
              >
                <Text>Th</Text>
              </ImageBackground>
            </Pressable>

            {/* Friday */}
            <Pressable
              onPressIn={() => {
                setSelectedF(!isSelectedF);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("F")}
              >
                <Text>F</Text>
              </ImageBackground>
            </Pressable>

            {/* Saturday */}
            <Pressable
              onPressIn={() => {
                setSelectedSa(!isSelectedSa);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("Sa")}
              >
                <Text>Sa</Text>
              </ImageBackground>
            </Pressable>

            {/* Sunday */}
            <Pressable
              onPressIn={() => {
                setSelectedSu(!isSelectedSu);
                forceUpdate();
              }} 
            >
              <ImageBackground
                style={tabStyles.selectableDay}
                source={whiteBox}
                tintColor={getTint("Su")}
              >
                <Text>Su</Text>
              </ImageBackground>
            </Pressable>
          </View>
        </ImageBackground>

        <Pressable onPress={submitActivity}>
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
    resizeMode: "cover",
    overflow: "hidden"
  },
  selectableDayContainer: {
    marginTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  selectableDay: {
    height: 44,
    width: 44, 
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
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