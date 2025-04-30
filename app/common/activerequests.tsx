import React, { useEffect, useState } from 'react'
import { 
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  ImageBackground,
  FlatList,
  View,
} from 'react-native'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import Modal from "react-native-modal";
import { LinearGradient } from 'expo-linear-gradient';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { getUserType, gradientColor, styles } from '@/constants/styles';
import whiteBox from '@/assets/images/white-box.png';
import homeIcon from '@/assets/images/home.png';
import { NavigationButton } from '@/components/nav-button';

type ItemData = {
    displayName: string,
    requesterUID: string,
    isPending: boolean
}

const activerequests = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;
  const userType = getUserType();
  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";
  const requestsReceivedCollection = collection(db, `/users/${user?.uid}/requestsReceived`);

  const [requests, setRequests] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  useEffect(() => {
    fetchRequests();
  }, [user])

  const fetchRequests = async () => {
    if (user) {
      const q = query(requestsReceivedCollection, where("isPending", "==", true));
      const data = await getDocs(q);
      setRequests(data.docs.map((doc) => ({ ...doc.data() })));
    }
  }

  const updateLinkingRequest = async (data: any, accepted: boolean) => {
    if (accepted) {
      const currentLinkedCollection = collection(db,
        `/users/${user?.uid}/${userCounterpart.toLowerCase()}s`);
      await setDoc(doc(currentLinkedCollection, data.requesterUID), {
        displayName: data.displayName,
        uid: data.requesterUID,
      });

      const receiverLinkedCollection = collection(db,
        `/users/${data.requesterUID}/${userType}s`);
      await setDoc(doc(receiverLinkedCollection, user?.uid), {
        displayName: user?.displayName,
        uid: user?.uid
      });
    }

    await setDoc(doc(requestsReceivedCollection, data.requesterUID), {
      isPending: false
    }, {merge: true});

    fetchRequests();
    setIsModalVisible(false);
  }

  const renderItem = ({item}: {item: ItemData}) => {
    return (
      <Pressable onPress={handleModal}>
        <ImageBackground 
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>{item.displayName}</Text>
          <Modal isVisible={isModalVisible}>
            <SafeAreaView>
              <ImageBackground
                style={tabStyles.modalContainer}
                source={whiteBox}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Accept {item.displayName}'s request?</Text>
                <Pressable onPress={() => updateLinkingRequest(item, true)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Accept</Text>
                  </ImageBackground>
                </Pressable>
                <Pressable onPress={() => updateLinkingRequest(item, false)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reject</Text>
                  </ImageBackground>
                </Pressable>
              </ImageBackground>
            </SafeAreaView>
          </Modal>
        </ImageBackground>
      </Pressable>
    )
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerStyle}>Recieved Requests</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <FlatList
          style={{ height: 150 }}
          data={requests}
          renderItem={renderItem}
        />
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
  },
  buttonContainer: {
    height: 80,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
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

export default activerequests