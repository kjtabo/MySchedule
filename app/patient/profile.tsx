import React from 'react'
import { Text, Button } from 'react-native'
import { router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from '@firebase/auth';

import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { styles, gradientColor } from '@/constants/styles';

const profile = () => {
  const auth = FIREBASE_AUTH;
  
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/login");
  });

  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColor}
    >
      <Text style={styles.headerStyle}>Profile</Text>
      <Button title="Sign Out" onPress={() => auth.signOut()}/>
    </LinearGradient>
  )
}

export default profile 