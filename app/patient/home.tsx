import React from 'react'
import { ImageBackground, Text, StyleSheet } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles, gradientColor } from '@/constants/styles';
import { NavigationButton } from '@/components/nav-button';
import whiteBox from '@/assets/images/white-box.png';
import progressIcon from '@/assets/images/graph.png';
import calendarIcon from '@/assets/images/calendar.png';
import profileIcon from '@/assets/images/person.png';

const home = () => {
  return (
    <LinearGradient
    style={styles.backgroundContainer}
    colors={gradientColor}
    >
      <SafeAreaView style={styles.contentContainer}>
        <SafeAreaView style={{ height: 300 }}>
          <Text style={styles.headerStyle}>Today's Task</Text>
          <Text>Task #1</Text>
          <Text>Task #2</Text>
          <Text>Task #3</Text>
          <Text>Task #4</Text>
        </SafeAreaView>
        <ImageBackground
          style={tabStyles.profileContainer}
          source={whiteBox}
        >
          <Text>Reminders</Text>
        </ImageBackground>
      </SafeAreaView>
      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton 
          name={'Schedule'}
          icon={calendarIcon}
          navTo={'/patient/schedule'}
        />
        <NavigationButton 
          name={'Progress'}
          icon={progressIcon}
          navTo={'/patient/progress'}
        />
        <NavigationButton 
          name={'Profile'}
          icon={profileIcon}
          navTo={'/common/profile'}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  profileContainer: {
    height: 300,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    resizeMode: "cover",
    overflow: "hidden"
  },
});

export default home