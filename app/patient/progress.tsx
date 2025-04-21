import { View, Text } from 'react-native'
import { styles, gradientColor } from '@/constants/styles';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react'

const progress = () => {
  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Progress</Text>
    </LinearGradient>
  )
}

export default progress