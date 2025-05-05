import { Stack } from "expo-router";
import './globals.css';
import React from "react";
// import { NotificationProvider } from "@/components/notifications-manager";
// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: false
//   }),
// });

const StackLayout = () => {
  // <NotificationProvider>
  // </NotificationProvider>
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
  );
}

export default StackLayout;
