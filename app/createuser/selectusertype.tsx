import React, { useReducer } from 'react'
import { Text, Button, Pressable, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router';

import { gradientColor, styles } from '@/constants/styles'
import whiteBox from '@/assets/images/white-box.png';

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
      style={styles.container}
      colors={gradientColor}
    >
      <SafeAreaView>
        <Text style={styles.headerStyle}>Select role</Text>

        <Pressable
          onPressIn={() => {
            isTherapist = !isTherapist;
            isPatient = false;
            updateTint();
            forceUpdate();
          }} 
        >
          <ImageBackground
            source={whiteBox}
            tintColor={therapistTint}
          >
            <Text>therapist</Text>
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
            source={whiteBox}
            tintColor={patientTint}
          >
            <Text>patient</Text>
          </ImageBackground>
        </Pressable>

        <Button title='Back to Login' onPress={() => router.replace("/common/login")}/>

        <Button title='Next' onPress={() => {
            if (isPatient) router.push('/createuser/patientinfo')
            else if (isTherapist) router.push('/createuser/therapistinfo')
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default selectusertype