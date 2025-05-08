import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo'
import { router } from 'expo-router'

const BackButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
      <View style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          overflow: "hidden"
        }}
      >
        <Entypo name='chevron-left' size={35} color="black"/>
      </View>
    </TouchableOpacity>
  )
}

export default BackButton