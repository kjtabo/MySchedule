import React from 'react'
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { getRecentNotifications, useNotification } from '@/components/notifications-manager'
import { gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'

import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';

const notifs = () => {
  const { notification, expoPushToken, error } = useNotification();
  const notifList = getRecentNotifications();

  const renderItem = (item: any) => {
    console.log(item);
    return (
      <ImageBackground
        style={tabStyles.buttonContainer}
        source={whiteBox}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {item.item.request.content.title}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {item.item.request.content.body}
        </Text>
      </ImageBackground>
    ) 
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Notifications</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <FlatList
          data={notifList}
          renderItem={renderItem}
        />
      </SafeAreaView>

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

const tabStyles = StyleSheet.create({
  buttonContainer: {
    height: 80,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: "center",
    overflow: "hidden"
  }
});

export default notifs