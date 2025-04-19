import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles, gradientColor } from '@/constants/styles';
import notifsIcon from '@/assets/images/bell.png';
import profileIcon from '@/assets/images/person.png';
import { NavigationButton } from '@/components/nav-button';

const home = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Patient Carryover</Text>
      <SafeAreaView style={{flex: 1, justifyContent: "flex-end"}}>
        <NavigationButton 
          name={'Notifications'}
          icon={notifsIcon}
          navTo={'/therapist/notifs'}
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

export default home