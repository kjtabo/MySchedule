import React, { useEffect, useReducer, useState } from 'react'
import {
  Text,
  SafeAreaView,
  ImageBackground,
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import Modal from 'react-native-modal';
import { useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'

import Ionicons from '@expo/vector-icons/Ionicons';
import homeIcon from '@/assets/images/home.png';
import calendarIcon from '@/assets/images/calendar.png';
import whiteBox from '@/assets/images/white-box.png';
import BackButton from '@/components/back-button';
import CustomHeader from '@/components/header';

const getDateToday = () => {
  return new Date().toISOString().split("T")[0];
}

const datedetail = () => {
  const params = useLocalSearchParams<{uid: string, selectedDate: string, dailyTasks: string}>();
  const uid = params.uid;
  const dateSelected = params.selectedDate;
  const dailyTasks = JSON.parse(params.dailyTasks);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();
  const remindersCollection = collection(db, `users/${uid}/reminders`);

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [newRemark, setNewRemark] = useState("");
  const [remarks, setRemarks] = useState<any>([])
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, [isModalVisible])

  const fetchReminders = async () => {
    const q = query(remindersCollection, where('createdAt', '==', dateSelected));
    const data = await getDocs(q);
    setRemarks(data.docs.map((doc) => ({ ...doc.data() })));
  }

  const submitReminder = async () => {
    await addDoc(remindersCollection, {
      createdAt: dateSelected,
      remark: newRemark,
      from: user?.uid
    })
    setModalVisible(false);
  }

  const renderTaskItem = (item: any) => {
    return (
      <Text style={{ fontSize: 18 }}>
        {`\u2022 ${item.item.name}`}
      </Text> 
    )
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
        centerChildren={<Text style={styles.headerStyle}>Schedule</Text>}
      />

      <SafeAreaView style={styles.contentContainer}>
        <ImageBackground
          style={tabStyles.tasksContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>
            {new Date(dateSelected).toDateString().split(" ")[1]} {new Date(dateSelected).getDate()} Tasks
          </Text>
          <View style={{ marginTop: 10, marginHorizontal: 20 }}>
            {dailyTasks.length != 0 && (
              <FlatList
                data={dailyTasks}
                renderItem={renderTaskItem}
              />
            )}
            {dailyTasks.length == 0 && (
              <Text style={{ alignSelf: "center", marginTop: 20 }}>Nothing to see here!</Text>
            )}
          </View>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.remarksContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Remarks</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.75, marginTop: 10, marginHorizontal: 20 }}>
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
            <Modal isVisible={isModalVisible}>
              <View style={tabStyles.modalContainer}>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 30, fontWeight: "bold", alignSelf: "center", marginTop: 10 }}>Write a Remark</Text>
                  <TextInput
                    style={tabStyles.multilineText}
                    placeholder='Write your newRemark'
                    onChangeText={setNewRemark}
                    value={newRemark}
                    multiline
                  />
                </View>
                <View style={{ flex: 0.2, alignItems: "center" }}>
                  <TouchableOpacity activeOpacity={0.7} onPress={submitReminder}>
                    <ImageBackground
                      style={tabStyles.modalButtons}
                      source={whiteBox}
                      tintColor={"#EDEDED"}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(false)}>
                    <ImageBackground
                      style={tabStyles.modalButtons}
                      source={whiteBox}
                      tintColor={"#EDEDED"}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={{ flex: 0.25, alignItems: "center", justifyContent: "center" }}>
              {userType == "therapist" && (
                <TouchableOpacity
                  className="bg-neutral-200 p-2 rounded-full"
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={() => {setModalVisible(true)}}
                >
                  <Ionicons name="add" size={30} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>  
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
  },
  modalContainer: {
    height: "60%",
    width: "85%",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  modalButtons: {
    height: 35,
    width: 200,
    marginVertical: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  multilineText: {
    marginTop: 10,
    padding: 10,
    textAlignVertical: "top",
    borderRadius: 20,
    borderColor: "#EDEDED",
    width: "80%",
    minHeight: "60%",
    color: "black",
    overflow: "hidden" 
  },
});

export default datedetail 