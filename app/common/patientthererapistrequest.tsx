import React, { useEffect, useState } from 'react'
import { 
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  ImageBackground,
  View,
} from 'react-native'
import {
  and,
  collection,
  doc,
  getDocs,
  or,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import Modal from 'react-native-modal'

import { getUserType, gradientColor, styles } from '@/constants/styles'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { NavigationButton } from '@/components/nav-button'

import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';

type ItemData = {
  firstName: string,
  lastName: string,
  displayName: string,
  email: string,
  type: string,
  uid: string,
  conditions?: string,
}

const patientthererapistrequest = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const userType = getUserType();
  const user = auth.currentUser;
  const usersCollection = collection(db, "users");
  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";

  const [toQuery, setToQuery] = useState("");
  const [queriedUsers, setQueriedUsers] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  useEffect(() => {
    fetchQueriedUsers();
  }, [user])

  const fetchQueriedUsers = async () => {
    if (user) {
      const splitQuery = toQuery.split(" ")
      const q = query(usersCollection, 
        and(
          where("type", "==", userCounterpart.toLowerCase()),
          or(
            where("firstName", "in", splitQuery),
            where("lastName", "in", splitQuery)
          )
        )
      );
      const data = await getDocs(q);
      setQueriedUsers(data.docs.map((doc) => ({ ...doc.data() })));
    }
  }

  const sendLinkingRequest = async (data: any) => {
    if (userType == "therapist") {
      const senderRequestsCollection = collection(
        db, `/users/${user?.uid}/requestsSent`)
      await setDoc(doc(senderRequestsCollection, data.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        hasAccepted: false
      });
      
      const receiverReceivedCollection = collection(
        db, `/users/${data.uid}/requestsReceived`);
      await setDoc(doc(receiverReceivedCollection, user?.uid), {
        displayName: user?.displayName,
        requesterUID: user?.uid,
        isPending: true
      });;
    }
    else if (userType == "patient") {
      const senderRequestsCollection = collection(
        db, `/users/${user?.uid}/requestsSent`)
      await setDoc(doc(senderRequestsCollection, data.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        conditions: data.conditions,
        hasAccepted: false
      });
      
      const receiverReceivedCollection = collection(
        db, `/users/${data.uid}/requestsReceived`);
      await setDoc(doc(receiverReceivedCollection, user?.uid), {
        displayName: user?.displayName,
        requesterUID: user?.uid,
        isPending: true
      });
    }

    setIsModalVisible(false);
  }

  const renderItem = ({item} : {item: ItemData}) => {
    return (
      <Pressable onPress={handleModal}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text style={tabStyles.buttonText}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
          <Modal isVisible={isModalVisible}>
            <SafeAreaView>
              <ImageBackground
                style={tabStyles.modalContainer}
                source={whiteBox}
              >
                <Text style={tabStyles.buttonText}>
                  Link with {item.firstName} {item.lastName}?
                </Text>
                <Pressable onPress={() => sendLinkingRequest(item)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Send Request</Text>
                  </ImageBackground>
                </Pressable>
                <Pressable onPress={() => setIsModalVisible(false)}>
                  <ImageBackground
                    style={tabStyles.modalButtons}
                    source={whiteBox}
                    tintColor={"#EDEDED"}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
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
        <Text style={styles.headerStyle}>Request</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <TextInput
          style={tabStyles.searchInput}
          placeholder={`Search for a ${userCounterpart}`} 
          value={toQuery}
          onChangeText={(text) => {setToQuery(text); fetchQueriedUsers();}}
        />
        <Text style={{ marginVertical: 10, marginHorizontal: 30 }}>Search Results</Text>
        <FlatList
          style={{ height: 150 }}
          data={queriedUsers}
          renderItem={renderItem}
        />
        <Pressable onPress={() => router.push("/common/activerequests")}>
          <ImageBackground
            style={tabStyles.seeRequestsButton}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Check Received Requests</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>

      <View style={styles.navButtonContainer}>
        <NavigationButton
          name={"Home"}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </View>
    </LinearGradient> 
  )
}

const tabStyles = StyleSheet.create({
  searchInput: {
    width: "90%",
    height: 50,
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "white",
    alignSelf: "center",
    overflow: "hidden"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize" 
  },
  buttonContainer: {
    height: 80,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
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
  seeRequestsButton: {
    height: 50,
    marginTop: 5,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  }
});

export default patientthererapistrequest