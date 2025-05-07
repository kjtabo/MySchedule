import React from 'react'
import { Platform, KeyboardAvoidingView, ScrollView } from 'react-native'

const ios = Platform.OS === "ios";
const CustomKeyboardView = ({children}: {children: any}) => {
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