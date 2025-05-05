import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'

const ios = Platform.OS === "ios";
const CustomKeyboardView = ({children}) => {
  return (
    <KeyboardAvoidingView
      behavior={ios? 'padding': 'height'}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {
          children
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardView