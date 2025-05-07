import { Stack } from "expo-router";
import React from "react";
import { NotificationProvider } from "@/components/notifications-manager";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false
  }),
});

const StackLayout = () => {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
      </Stack>
    </NotificationProvider>
  );
}

export default StackLayout;
