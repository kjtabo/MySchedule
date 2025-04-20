import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ headerShown: false }}/>
      <Stack.Screen name="newactivity" options={{ headerShown: false }}/>
      <Stack.Screen name="notifs" options={{ headerShown: false }}/>
    </Stack>
  )
}

export default StackLayout;