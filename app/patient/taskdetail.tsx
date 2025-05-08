import React, { useState } from 'react'
import {
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
  SafeAreaView,
  View,
  TouchableOpacity
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';

import { gradientColor, styles } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';

import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';
import Stopwatch from '@/components/stopwatch';
import CustomHeader from '@/components/header';
import BackButton from '@/components/back-button';

const taskdetail = () => {
  const params = useLocalSearchParams<{taskName: string, details: string, doneDates: string}>();
  const taskName = params.taskName;
  const details = params.details;
  const doneDates = params.doneDates;

  const [elapsedTime, setElapsedTime] = useState(0);

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <CustomHeader
        leftChildren={<BackButton/>}
        centerChildren={<Text style={styles.headerStyle}>{taskName}</Text>}
      />

      <SafeAreaView style={styles.contentContainer}>
        <ImageBackground
          style={tabStyles.instructionsContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.containerHeader}>What do I do?</Text>
          <Text>{details}</Text>
        </ImageBackground>
        <ImageBackground
          style={tabStyles.stopwatchContainer}
          source={whiteBox}
        >
          <Stopwatch getTimeValue={setElapsedTime}/>
        </ImageBackground>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={"/patient/home"}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/patient/taskfeedback",
              params: {taskName: taskName, elapsedTime: elapsedTime.toString(), doneDates: doneDates}
            });
          }}
        >
          <ImageBackground
            style={tabStyles.doneButtonContainer}
            source={whiteBox}
          >
            <Text style={{ fontSize: 45, fontWeight: "bold" }}>Done!</Text>
          </ImageBackground>
        </TouchableOpacity>
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
  instructionsContainer: {
    flex: 0.60,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    padding: 30,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  stopwatchContainer: {
    flex: 0.30,
    marginLeft: 20,
    marginRight: 20,
    padding: 30,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
  doneButtonContainer: {
    height: 105,
    width: 210,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
})

export default taskdetail