import { StyleSheet, Text, SafeAreaView, Pressable, ImageBackground, FlatList, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import whiteBox from '@/assets/images/white-box.png';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserType, gradientColor, styles } from '@/constants/styles';
import Modal from "react-native-modal";

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
        uid: data.requesterUID
      });

      const receiverLinkedCollection = collection(db,
        `/users/${data.requesterUID}/${userType}s`);
      await setDoc(doc(receiverLinkedCollection, user?.uid), {
        displayName: user?.displayName,
        uid: user?.uid
      });
    }

    await setDoc(doc(requestsReceivedCollection, data.requesterUID), {
      displayName: data.displayName,
      requesterUID: data.requesterUID,
      isPending: false
    });

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
          <Text>{`${item.displayName}`}</Text>
          <Modal isVisible={isModalVisible}>
            <SafeAreaView>
              <ImageBackground
                style={tabStyles.modalContainer}
                source={whiteBox}
              >
                <Text>Accept {item.displayName}'s request?</Text>
                <Button title='Accept' onPress={() => updateLinkingRequest(item, true)}/>
                <Button title='Reject' onPress={() => updateLinkingRequest(item, false)}/>
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
      <Text style={styles.headerStyle}>Requests</Text>
      <FlatList
        style={{ height: 150 }}
        data={requests}
        renderItem={renderItem}
      />
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

export default activerequests