import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { EventSubscription } from "expo-modules-core";
import { setPushToken } from "@/constants/expo-push-token";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      lightColor: "#FF231F7C"
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") 
      throw new Error("Permission not granted to get push token for push notification!");

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId)
      throw new Error("Project ID not found");

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      // console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  }
  else {
    throw new Error("Must use physical device for push notifications.");
  }
}

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

var notificationsArray: any[] = [];

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<EventSubscription>();
  const responseListener = useRef<EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );
    setPushToken(expoPushToken);

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("NOTIF RECEIVED", notification);
      setNotification(notification);
      storeNotif();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        "NOTIF RESPONSE: ",
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2)
      );
      // HANDLE RESPONSE HERE
    });

    return () => {
      if (notificationListener.current)
        notificationListener.current.remove();
      if (responseListener.current)
        responseListener.current.remove();
    };
  }, []);

  const storeNotif = async () => {
    console.log(notification)
  }

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const sendNotifications = async (receiverToken: string, title: string, body: string, data?: object) => {
  const message = {
    to: receiverToken,
    sound: 'default',
    title: title,
    body: body,
  };

  const ticket = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  });
  console.log(ticket.status);
}

export const getRecentNotifications = () => {
  if (notificationsArray.length >= 5) {
    notificationsArray.length = 5
    return notificationsArray;
  }
  else
    return notificationsArray;
}