import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '@/constants/styles'

const CustomHeader = ({
    leftChildren,
    centerChildren,
    rightChildren
}: {
    leftChildren?: any,
    centerChildren?: any,
    rightChildren?: any   
}) => {
  return (
      <View style={{ ...styles.headerContainer, flexDirection: "row", paddingHorizontal: 10 }}>
        <View style={{ flex: 0.2, justifyContent: "flex-end" }}>
            { leftChildren }
        </View>

        <View style={{ flex: 0.6, justifyContent: "flex-end" }}>
            { centerChildren }
        </View>

        <View style={{ flex: 0.2, justifyContent: "flex-end", alignItems: "flex-end" }}>
            { rightChildren }
        </View>
      </View>
  )
}

export default CustomHeader