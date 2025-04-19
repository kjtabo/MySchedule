import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { Href, router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { setUserType } from '@/constants/styles';

const login = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const [email, setEmail] = useState('patient1@test.com');
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
    <View>
      <Text>login</Text>
      <TextInput 
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={signIn}/>
      <Button title="Create an account" onPress={() => router.replace('/createuser/selectusertype')}/>
    </View>
  )
}

export default login