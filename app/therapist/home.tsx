import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles, gradientColor } from '@/constants/styles';
import notifsIcon from '@/assets/images/bell.png';
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
            name={'Notifications'}
            icon={notifsIcon}
            navTo={'/therapist/notifs'}
          />
          <NavigationButton 
            name={'Profile'}
            icon={profileIcon}
            navTo={'/therapist/profile'}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default home