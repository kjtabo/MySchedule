import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
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
  const [isLoading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const docRef = doc(db, "users", user.user.uid);
        const userData = await getDoc(docRef);
        setUserType(userData.data()?.type);
        setLoading(false);
        router.replace(`/${userData.data()?.type}/home` as Href);
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      alert("Sign In failed: " + error.message);
    }
  }

  return (
    <LinearGradient
      style={styles.backgroundContainer}
      colors={gradientColor}
    >
      <View style={{ flex: 0.3, justifyContent: "flex-end", paddingBottom: 20 }}>
        <Text style={tabStyles.welcomeText}>Welcome to</Text>
        <Text style={tabStyles.welcomeText}>MySchedule!</Text>
      </View>

      <View style={{ flex: 0.2 }}>
        <TextInput
          style={tabStyles.searchInput}
          placeholder='Email'
          placeholderTextColor={"#BBBBBB"}
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />
        <TextInput 
          style={tabStyles.searchInput}
          placeholder='Password'
          placeholderTextColor={"#BBBBBB"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!isLoading}
        />
      </View>

      <View style={{ flex: 0.5 }}>
        {isLoading ? <ActivityIndicator size={"large"} color={"white"} style={{marginTop: 30}}/> :
          <>
            <TouchableOpacity activeOpacity={0.7} onPress={signIn}>
              <ImageBackground
                style={tabStyles.loginButtons}
                source={whiteBox}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Login</Text>
              </ImageBackground>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, alignSelf: "center", marginBottom: 5 }}>or</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/createuser/selectusertype')}>
              <ImageBackground
                style={tabStyles.loginButtons}
                source={whiteBox}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Create an account</Text>
              </ImageBackground>
            </TouchableOpacity>
          </>
        }
      </View>
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