import React, { useEffect, useReducer, useState } from 'react'
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'

import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import Modal from 'react-native-modal'
import CustomHeader from '@/components/header'
import BackButton from '@/components/back-button'

var notifList: any = [];
const notifs = () => {
  const userType = getUserType();

  const user = FIREBASE_AUTH.currentUser;
  const db = FIREBASE_DB;

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [user, isModalVisible]);

  const fetchNotifications = async () => {
    const q = query(collection(db, "users", `${user?.uid}`, "notifs"), where("read", "!=", true));
    const data = await getDocs(q);
    notifList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    forceUpdate();
  }

  const markAsRead = async (id: string) => {
    console.log(id);
    await setDoc(doc(collection(db, "users", `${user?.uid}`, "notifs"), id), {
      read: true
    }, {merge: true})
    setModalVisible(false);
  }

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(!isModalVisible)}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.item.title}
            </Text>
            <Text style={{ fontSize: 15 }}>
              {item.item.read ? "Read" : "Unread"}
            </Text>
          </View>
          <Text style={{ fontSize: 20 }}>
            {item.item.body}
          </Text>
          <Modal isVisible={isModalVisible}>
            <SafeAreaView>
              <ImageBackground
                style={tabStyles.modalContainer}
                source={whiteBox}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mark this notification as read?</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => markAsRead(item.item.id)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mark as read</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(false)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cancel</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </ImageBackground>
            </SafeAreaView>
          </Modal>
        </ImageBackground>
      </TouchableOpacity>
    ) 
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <CustomHeader
        leftChildren={<BackButton/>}
        centerChildren={<Text style={styles.headerStyle}>Notifications</Text>}
      />

      <SafeAreaView style={styles.contentContainer}>
        {notifList.length == 0 ?
          <Text style={{ fontSize: 20, alignSelf: "center", marginTop: 20 }}>Nothing to see here!</Text>
            : 
          <FlatList
            data={notifList}
            renderItem={renderItem}
          />
        }
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton
          name={'Home'}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </View>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  buttonContainer: {
    height: 80,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: "center",
    overflow: "hidden"
  },
  modalContainer: {
    height: 150,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  modalButtons: {
    height: 35,
    width: 200,
    marginVertical: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
});

export default notifs