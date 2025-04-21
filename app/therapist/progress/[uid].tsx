import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const progress = () => {
  const { uid } = useLocalSearchParams();
  
  return (
    <View>
      <Text>{uid}</Text>
    </View>
  )
}

export default progress