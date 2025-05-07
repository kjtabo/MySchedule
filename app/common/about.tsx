import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'

import homeIcon from '@/assets/images/home.png';

const about = () => {
  const userType = getUserType();
  
  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>About</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <View style={tabStyles.aboutContainer}>
          <Text style={tabStyles.aboutText}>
            MySchedule is a simple routine 
            assistant designed for 
            neurodivergent users. It helps 
            with task management, 
            reminders, and daily routines 
            using visual cues.  
            It makes scheduling easy and 
            accessible for anyone and 
            everyone.
          </Text>
        </View>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Home'}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </View>
    </LinearGradient> 
  )
}

const tabStyles = StyleSheet.create({
  aboutContainer: {
    height: 400,
    marginTop: 40,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 30,
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden"
  },
  aboutText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default about