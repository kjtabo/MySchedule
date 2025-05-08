import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  setDoc,
  doc,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

import { sendNotifications } from '@/components/notifications-manager';
import { gradientColor, styles } from '@/constants/styles';
import CustomKeyboardView from '@/components/custom-keyboard-view';
import MessageItem from '@/components/message-item';

import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

const getRoomID = (uid1: string | undefined, uid2: string | undefined) => {
  if (uid1 == undefined || uid2 == undefined) return '';
  const sortedIDs = [uid1, uid2].sort();
  return sortedIDs.join('-'); 
}

const chatroom = () => {
  const params = useLocalSearchParams<{ displayName: string, uid: string }>();
  const otherDisplayName = params.displayName;
  const otherUID = params.uid;

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const user = auth.currentUser;

  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [isLoading, setLoading] = useState(true);

  const textRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    createNewChatRoom();

    let roomID = getRoomID(user?.uid, otherUID);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdOn', 'asc'));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {return doc.data()});
      setMessages([ ...allMessages ])
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    )

    setLoading(false);
    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    }
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages])

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: false})
    }, 100);
  }
  
  const createNewChatRoom = async () => {
    const roomID = getRoomID(user?.uid, otherUID);
    if (roomID.length == 0) return;
    
    await setDoc(doc(db, "rooms", roomID), {
      roomID,
      createdOn: Timestamp.fromDate(new Date())
    })
  }
 
  const sendMessage = async () => {
    let message = textRef.current.trim(); 
    if (!message) return;

    try {
      const roomID = getRoomID(user?.uid, otherUID);
      const docRef = doc(db, "rooms", roomID);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();
      await addDoc(messagesRef, {
        senderUID: user?.uid,
        senderName: user?.displayName,
        message: message,
        createdOn: Timestamp.fromDate(new Date())
      });
      
      const token = "ExponentPushToken[vidUYsEKJdoQ4QsRUV9ewg]";
      const title = `${user?.displayName} sent you a message.`
      sendNotifications(token, title, message, {"receiver": otherUID});
    } catch (error: any) {
      Alert.alert("Message", error.message)
    }
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <CustomKeyboardView>
        <View style={tabStyles.chatHeaderContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={30} color="black" style={{ paddingHorizontal: 10 }} />
          </TouchableOpacity>
          <Text style={tabStyles.chatHeaderText}>{otherDisplayName}</Text>
        </View>

        <SafeAreaView style={tabStyles.chatBoxContainer}>
          <View style={{ flex: 1, justifyContent: "space-between", overflow: "visible"}}>
            {/* Message List */}
            {isLoading ? <ActivityIndicator size={"large"} color={"white"} style={{ marginTop: 80 }}/> : 
              <View style={{ flex: 1 }}>
                <ScrollView
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingTop: 10 }}
                >
                  {
                    messages.map((message: any, index: any) => {
                      return ( 
                        <MessageItem message={message} currentUserID={user?.uid} key={index}/>
                      )
                    })
                  }
                </ScrollView>
              </View>
            }

            {/* Text Input */}
            <View style={{ marginBottom: 10, paddingTop: 2 }}>
              <View style={tabStyles.textInputStyle}>
                <TextInput
                  ref={inputRef}
                  onChangeText={value => textRef.current = value}
                  style={{ flex: 1, fontSize: 20, marginRight: 5, color: "black" }}
                  placeholder='Message'
                />
                <TouchableOpacity 
                  style={tabStyles.sendButtonStyle}
                  onPress={sendMessage}  
                >
                  <Feather name="send" size={25} color="737373"/>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </SafeAreaView>
      </CustomKeyboardView>
    </LinearGradient>
  );
}

const tabStyles = StyleSheet.create({
  chatHeaderText: {
    fontSize: 30,
    fontWeight: "bold"
  },
  chatBoxContainer: {
    flex: 0.88,
    overflow: "visible",
  },
  textInputStyle: {
    borderRadius: 30,
    marginHorizontal: 10,
    borderWidth: 2,
    paddingLeft: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"space-between",
    flexDirection: "row",
    color: "black",
    backgroundColor: "white",
    borderColor: "#EDEDED",
  },
  chatHeaderContainer: {
    flex: 0.15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden"
  },
  sendButtonStyle: {
    height: 40,
    width: 40,
    marginRight: 5,
    marginVertical: 5,
    borderRadius: 20,
    padding: 2,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  }
})

export default chatroom;