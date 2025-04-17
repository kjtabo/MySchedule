import React, { useState } from 'react'
import { Text, SafeAreaView, Button, TextInput } from 'react-native'
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';

const patientinfo = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [conditions, setConditions] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) updateProfile(auth.currentUser, {displayName: `${firstName} ${lastName}`})
      if (user) router.replace("/patient/home");
    } catch (error: any) {
      console.log(error);
      alert("Sign In failed: " + error.message);
    }
  }
  return (
    <SafeAreaView>
      <Text>login</Text>
        <TextInput 
          placeholder='First Name'
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput 
          placeholder='Last Name'
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput 
          placeholder='Conditions'
          value={conditions}
          onChangeText={setConditions}
        />
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
        <Button title="Make account" onPress={signUp}/>
    </SafeAreaView>
  )
}

export default patientinfo 