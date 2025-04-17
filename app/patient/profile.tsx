import { View, Text } from 'react-native'
import { styles, gradientColor } from '@/constants/styles';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react'

const profile = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Profile</Text>
    </LinearGradient>
  )
}

export default profile 