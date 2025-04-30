import React, { useReducer } from 'react'
import {
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router';

import { gradientColor, styles } from '@/constants/styles'
import whiteBox from '@/assets/images/white-box.png';
import therapistIcon from '@/assets/images/therapist.png';
import patientIcon from '@/assets/images/patient.png';

let isPatient = false;
let isTherapist = false;
let patientTint = "#FFFFFF";
let therapistTint = "#FFFFFF";

function updateTint() {
  patientTint = isPatient ? "#D8D8D8" : "#FFFFFF";
  therapistTint = isTherapist ? "#D8D8D8" : "#FFFFFF";
}

const selectusertype = () => {
  // broken ahh force update
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Select role</Text>
      <SafeAreaView style={{ ...styles.contentContainer, justifyContent: "center" }}>
        <SafeAreaView style={tabStyles.userTypeContainer}>
          <Pressable
            onPressIn={() => {
              isTherapist = !isTherapist;
              isPatient = false;
              updateTint();
              forceUpdate();
            }} 
          >
            <ImageBackground
              style={tabStyles.userTypeImage}
              source={whiteBox}
              tintColor={therapistTint}
            >
              <Image source={therapistIcon}/>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Therapist</Text>
            </ImageBackground>
          </Pressable>

          <Pressable
            onPressIn={() => {
              isTherapist = false;
              isPatient = !isPatient;
              updateTint();
              forceUpdate()
            }} 
          >
            <ImageBackground
              style={tabStyles.userTypeImage}
              source={whiteBox}
              tintColor={patientTint}
            >
              <Image source={patientIcon}/>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Patient</Text>
            </ImageBackground>
          </Pressable>
        </SafeAreaView>
        <Pressable onPress={() => {
            if (isPatient) router.push('/createuser/patientinfo');
            else if (isTherapist) router.push('/createuser/therapistinfo');
            else alert("Please select a role.");
          }}
        >
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Next</Text>
          </ImageBackground>
        </Pressable>
        <Pressable onPress={() => router.replace("/common/login")}>
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back to Login</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  welcomeText: {
    fontSize: 40,
    marginTop: 10,
    alignSelf: "center",
    fontWeight: "bold"
  },
  userTypeImage: {
    width: 160,
    height: 160,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  userTypeContainer: {
    marginBottom: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  loginButtons: {
    height: 50,
    marginTop: 5,
    marginHorizontal: 80,
    marginBottom: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  }
});

export default selectusertype