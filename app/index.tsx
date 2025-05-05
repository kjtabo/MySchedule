import { Href, Redirect } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setUserType, styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { setStatusBarHidden } from "expo-status-bar";
import React from "react";
// import { useNotification } from "@/components/notifications-manager";

export default function Index() {
  setStatusBarHidden(true);

  const user = FIREBASE_AUTH.currentUser;
  const db = FIREBASE_DB;
  // const { notification, expoPushToken, error } = useNotification();

  // if (error) return;
  // console.log(expoPushToken);
  // console.log(JSON.stringify(notification, null, 2));

  const attemptSignIn = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const userData = await getDoc(docRef);
      setUserType(userData.data()?.type);
      return <Redirect href={`/${userData.data()?.type}/home` as Href}/>
    }
  }

  if (user) attemptSignIn();
  else return <Redirect href="/common/login"/>

  // return (
  //   <View style={{ flex: 1 }}>
  //     <View style={{ ...styles.headerContainer, backgroundColor: "green" }}/>
  //     <View style={{ ...styles.homeContainer, backgroundColor: "red" }}/>
  //     {/* <View style={{ ...styles.contentContainer, backgroundColor: "red" }}/> */}
  //     <View style={{ ...styles.navButtonContainer, backgroundColor: "green" }}/>
  //   </View>
  // )
}