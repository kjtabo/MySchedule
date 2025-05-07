import React, { useState } from 'react'
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ImageBackground
} from 'react-native'
import { Href, router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { gradientColor, setUserType, styles } from '@/constants/styles';

import whiteBox from '@/assets/images/white-box.png';

const login = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const [email, setEmail] = useState('therapist1@test.com');
  const [password, setPassword] = useState('testtest');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const docRef = doc(db, "users", user.user.uid);
        const userData = await getDoc(docRef);
        setUserType(userData.data()?.type);
        router.replace(`/${userData.data()?.type}/home` as Href);
      }
    } catch (error: any) {
      console.log(error);
      alert("Sign In failed: " + error.message);
    }
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <SafeAreaView style={{ ...styles.contentContainer, justifyContent: "center" }}>
        <Text style={tabStyles.welcomeText}>Welcome to</Text>
        <Text style={tabStyles.welcomeText}>MySchedule!</Text>
        <TextInput
          style={tabStyles.searchInput}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          style={tabStyles.searchInput}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Pressable onPress={signIn}>
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Login</Text>
          </ImageBackground>
        </Pressable>
        <Pressable onPress={() => router.replace('/createuser/selectusertype')}>
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Create an account</Text>
          </ImageBackground>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  )
}

const tabStyles = StyleSheet.create({
  welcomeText: {
    fontSize: 40,
    marginTop: 10,
    color: "black",
    alignSelf: "center",
    fontWeight: "bold"
  },
  searchInput: {
    width: "90%",
    height: 50,
    borderWidth: 2,
    borderRadius: 30,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "white",
    alignSelf: "center",
    overflow: "hidden"
  },
  loginButtons: {
    height: 50,
    marginTop: 5,
    marginHorizontal: 80,
    marginBottom: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden"
  }
});
export default login