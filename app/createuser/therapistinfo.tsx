import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  ImageBackground,
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, doc, setDoc } from 'firebase/firestore';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { gradientColor, setUserType, styles } from '@/constants/styles';
import whiteBox from '@/assets/images/white-box.png';

const therapistinfo = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const usersCollection = collection(db, "users");

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signUp = async () => {
    if (firstName == "" || lastName == "") {
      alert("Please indicate you name.")
      return;
    }
    
    if (password != confirmPassword) {
      alert("Passwords do not match.")
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {displayName: `${firstName} ${lastName}`})

        await setDoc(doc(usersCollection, user.user.uid), {
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          displayName: firstName + " " + lastName,
          email: email,
          type: "therapist",
          uid: user.user.uid,
        });
      }
      setUserType("therapist");
      if (user) router.replace("/therapist/home");
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
        <Text style={tabStyles.welcomeText}>Therapist Information</Text>
        <TextInput
          style={tabStyles.searchInput}
          placeholder='First Name'
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tabStyles.searchInput}
          placeholder='Last Name'
          value={lastName}
          onChangeText={setLastName}
        />
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
          secureTextEntry
        />
        <TextInput
          style={tabStyles.searchInput}
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Pressable onPress={signUp}>
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Make your account</Text>
          </ImageBackground>
        </Pressable>
        <Pressable onPress={() => router.replace("/common/login")}>
          <ImageBackground
            style={tabStyles.loginButtons}
            source={whiteBox}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back to Login</Text>
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

export default therapistinfo