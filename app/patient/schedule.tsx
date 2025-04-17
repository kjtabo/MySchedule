import { View, Text } from 'react-native'
import { styles, gradientColor } from '@/constants/styles';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react'

const schedule = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Schedule</Text>
    </LinearGradient>
  )
}

export default schedule