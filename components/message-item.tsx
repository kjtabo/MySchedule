import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const MessageItem = ({
    message,
    currentUserID
  } : {
    message: any,
    currentUserID: any
  }
) => {
  if (currentUserID == message.senderUID) {
    return (
      <View style={itemStyles.selfContainerStyle}>
        <View style={{}}>
          <View style={itemStyles.selfMessageContainer}>
            <Text style={{ fontSize: 20 }}>{message?.message}</Text>
          </View>
        </View>
      </View>
    ) 
  }
  else {
    return (
      <View style={itemStyles.othersContainerStyle}>
        <View style={itemStyles.othersMessageContainer}>
          <Text style={{ fontSize: 20 }}>{message?.message}</Text>
        </View>
      </View>
    )
  }
}

const itemStyles = StyleSheet.create({
  selfContainerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5, 
    marginRight: 10 
  },
  selfMessageContainer: {
    padding: 10,
    borderRadius: 30,
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderColor: "#EDEDED"
  },
  othersContainerStyle: {
    marginBottom: 5,
    marginLeft: 10
  },
  othersMessageContainer: {
    padding: 10,
    borderRadius: 30,
    alignSelf: "flex-start",
    backgroundColor: "indigo",
    borderColor: "#EDEDED"
  }
})

export default MessageItem