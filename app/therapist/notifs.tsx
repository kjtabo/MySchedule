import { SafeAreaView, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';

const notifs = () => {
  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Notifications</Text>
      </View>
      <View style={styles.navButtonContainer}>
        <NavigationButton
          name={'Home'}
          icon={homeIcon}
          navTo={"/therapist/home"}
        />
      </View>
    </LinearGradient>
  )
}

export default notifs