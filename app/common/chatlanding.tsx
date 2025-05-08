import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { collection, getDocs } from 'firebase/firestore'

import { getUserType, gradientColor, styles } from '@/constants/styles'
import { NavigationButton } from '@/components/nav-button'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'

import homeIcon from '@/assets/images/home.png';
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
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkedUsersList();
  }, [user]);

  const fetchLinkedUsersList = async () => {
    const linkedUsersListCollection = collection(db, "users", `${user?.uid}`, `${userCounterpart.toLowerCase()}s`);
    const data = await getDocs(linkedUsersListCollection);
    setLinkedUsersList(data.docs.map((doc) => ({ ...doc.data() })));
    setLoading(false);
  }

  const renderItem = ({item}: {item: ItemData}) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => {
          router.push({pathname: "/common/chatroom", params: { displayName: item.displayName, uid: item.uid }})
        }}
      >
        <ImageBackground
          style={tabStyles.buttonContainer}
          source={whiteBox}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.displayName}</Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={styles.headerContainer}>
        <Text style={tabStyles.tabHeader}>Chat with your {userCounterpart}s</Text>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        {isLoading ? <ActivityIndicator size={"large"} color={"white"} style={{marginTop: 80}}/> :
          <FlatList
            data={linkedUsersList}
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
  },
  tabHeader: {
    fontSize: 30, 
    fontWeight: "bold",
    marginLeft: 20,
  }
});

export default chatlanding