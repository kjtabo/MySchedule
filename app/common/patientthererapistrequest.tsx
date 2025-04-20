import { 
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  ImageBackground,
  Button,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { getUserType, gradientColor, styles } from '@/constants/styles'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { and, collection, doc, getDoc, getDocs, or, query, Query, setDoc, where } from 'firebase/firestore'
import homeIcon from '@/assets/images/home.png';
import whiteBox from '@/assets/images/white-box.png';
import { NavigationButton } from '@/components/nav-button'
import { router } from 'expo-router'
import Modal from 'react-native-modal'

type ItemData = {
  firstName: string,
  lastName: string,
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
    console.log("hi");
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
    });

    setIsModalVisible(false);
  }

  const renderItem = ({item} : {item: ItemData}) => {
    return (
      <Pressable onPress={handleModal}>
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text>{`${item.firstName} ${item.lastName}`}</Text>
          <Modal isVisible={isModalVisible}>
            <SafeAreaView>
              <ImageBackground
                style={tabStyles.modalContainer}
                source={whiteBox}
              >
                <Text>Link with {item.firstName}?</Text>
                <Button title='Send Request' onPress={() => sendLinkingRequest(item)}/>
                <Button title='Back' onPress={() => setIsModalVisible(false)}/>
              </ImageBackground>
            </SafeAreaView>
          </Modal>
        </ImageBackground>
      </Pressable>
    )
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Request</Text>
      <Button title="Check received requests" onPress={() => router.push("/common/activerequests")}/>
      <TextInput
        placeholder={`Search for a ${userCounterpart}`} 
        value={toQuery}
        onChangeText={(text) => {setToQuery(text); fetchQueriedUsers();}}
      />
      <FlatList
        style={{ height: 150 }}
        data={queriedUsers}
        renderItem={renderItem}
        keyExtractor={item => item.uid}
      />
      <SafeAreaView style={styles.navButtonContainer}>
        <NavigationButton
          name={"Home"}
          icon={homeIcon}
          navTo={`/${userType}/home`}
        />
      </SafeAreaView>
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
    height: 80,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
});

export default patientthererapistrequest