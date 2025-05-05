import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import homeIcon from '@/assets/images/home.png';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { Href, router } from 'expo-router'
import whiteBox from '@/assets/images/white-box.png';

type ItemData = {
  displayName: string;
  uid: string;
};

const getRoomID = (uid1: string | undefined, uid2: string | undefined) => {
  if (uid1 == undefined || uid2 == undefined) return '';
  const sortedIDs = [uid1, uid2].sort();
  return sortedIDs.join('-'); 
}

const chatlanding = () => {
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;

  const user = auth.currentUser;

  const userType = getUserType();
  const userCounterpart = userType == "therapist" ? "Patient" : "Therapist";

  const [linkedUsersList, setLinkedUsersList] = useState<any>([]);

  useEffect(() => {
    fetchLinkedUsersList();
  }, [user]);

  const fetchLinkedUsersList = async () => {
    const linkedUsersListCollection = collection(db, "users", `${user?.uid}`, `${userCounterpart.toLowerCase()}s`);
    const data = await getDocs(linkedUsersListCollection);
    setLinkedUsersList(data.docs.map((doc) => ({ ...doc.data() })));
  }

  const renderItem = ({item}: {item: ItemData}) => {
    return (
      <Pressable onPress={() => {
          router.push({pathname: "/common/chatroom", params: { displayName: item.displayName, uid: item.uid }})
        }}
      >
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.displayName}</Text>
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
        <Text style={styles.headerStyle}>Chat with your {userCounterpart}s</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        <FlatList
          data={linkedUsersList}
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
  );
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

export default chatlanding