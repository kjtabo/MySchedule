import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles, gradientColor } from '@/constants/styles';
import progressIcon from '@/assets/images/graph.png';
import calendarIcon from '@/assets/images/calendar.png';
import profileIcon from '@/assets/images/person.png';
import NavigationButton from '@/components/nav-button';

const home = () => {
  return (
    <LinearGradient
    style={styles.container}
    colors={gradientColor}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerStyle}>Home</Text>
        </View>
        <View style={styles.navButtonContainer}>
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
            navTo={'/patient/profile'}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default home