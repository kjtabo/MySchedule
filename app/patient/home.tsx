import React from 'react'
import { ImageBackground, Text, View, StyleSheet } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles, gradientColor } from '@/constants/styles';
import whiteBox from '@/assets/images/white-box.png';
import progressIcon from '@/assets/images/graph.png';
import calendarIcon from '@/assets/images/calendar.png';
import profileIcon from '@/assets/images/person.png';
import { NavigationButton } from '@/components/nav-button';

const home = () => {
  return (
    <LinearGradient
    style={styles.container}
    colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Home</Text>

      <ImageBackground
          style={tabStyles.profileContainer}
          source={whiteBox}
        >
          <Text>Hi</Text>
      </ImageBackground>

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