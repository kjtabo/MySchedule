import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';

import { FIREBASE_AUTH } from "@/FirebaseConfig";

const login = () => {
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/patient/home");
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