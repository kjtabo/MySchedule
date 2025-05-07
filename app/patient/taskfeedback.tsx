import React, { useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  TextInput
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { collection, doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

import { gradientColor, styles } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';

import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';
import react8 from '@/assets/images/reaction8.png';
import react7 from '@/assets/images/reaction7.png';
import react6 from '@/assets/images/reaction6.png';
import react5 from '@/assets/images/reaction5.png';
import react4 from '@/assets/images/reaction4.png';
import react3 from '@/assets/images/reaction3.png';
import react2 from '@/assets/images/reaction2.png';
import react1 from '@/assets/images/reaction1.png';

const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const taskfeedback = () => {
  const params = useLocalSearchParams<{taskName: string, elapsedTime: string, doneDates: string}>();
  const taskName = params.taskName;
  const elapsedTime = params.elapsedTime;
  const doneDates = JSON.parse(params.doneDates);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [selectedReaction, setSelectedReaction] = useState(0);
  const [taskComment, setTaskComment] = useState("");

  const toggleOpacity = (id: number) => {
    setSelectedReaction(selectedReaction == id ? 0 : id);
  }

  const getOpacity = (id: number) => {
    return selectedReaction == id ? 0.25 : 1.0;
  }

  const submitFeedback = async () => {
    if (selectedReaction == 0) {
      alert("Tell us how you felt doing this task!");
      return;
    }

    doneDates.push(getDateToday());
    const tasksCollection = collection(db, `users/${user?.uid}/tasks`);
    await setDoc(doc(tasksCollection, taskName), {
      doneDates: doneDates,
      taskDuration: elapsedTime,
      patientRating: selectedReaction,
      patientComment: taskComment
    }, {merge: true});

    router.replace("/patient/home");
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>{taskName}</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <ImageBackground
          style={tabStyles.reactionContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>How did I feel doing this task?</Text>
          <View style={tabStyles.reactionRowContainer}>
            <Pressable onPress={() => toggleOpacity(8)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(8)}} source={react8}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(7)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(7)}} source={react7}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(6)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(6)}} source={react6}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(5)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(5)}} source={react5}/>
            </Pressable>
          </View>
          <View style={tabStyles.reactionRowContainer}>
            <Pressable onPress={() => toggleOpacity(4)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(4)}} source={react4}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(3)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(3)}} source={react3}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(2)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(2)}} source={react2}/>
            </Pressable>
            <Pressable onPress={() => toggleOpacity(1)}>
              <Image style={{...tabStyles.reactionIcon, opacity: getOpacity(1)}} source={react1}/>
            </Pressable>
          </View>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.commentsContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>Is there anything I want to say?</Text>
          <TextInput
            style={{ marginLeft: 10, color: "black" }}
            placeholder='Remarks'
            value={taskComment}
            onChangeText={setTaskComment}
          />
        </ImageBackground>
        <Pressable onPress={submitFeedback}>
          <ImageBackground
            style={tabStyles.submitButtonContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit!</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={"/patient/home"}
        />
      </View>
    </LinearGradient>
  );
}

const tabStyles= StyleSheet.create({
  containerHeader: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center"
  },
  reactionIcon: {
    height: 80,
    marginInline: -15,
    resizeMode: "contain",
  },
  reactionContainer: {
    flex: 0.5,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 30,
    paddingTop: 25,
    alignItems: "center",
    overflow: "hidden"
  },
  reactionRowContainer: {
    flex: 0.4,
    height: 15,
    marginTop: 5,
    flexWrap: "wrap",
  },
  commentsContainer: {
    flex: 0.5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  submitButtonContainer: {
    height: 50,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  },
});

export default taskfeedback