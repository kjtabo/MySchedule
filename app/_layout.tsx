import { Stack } from "expo-router";
import './globals.css';

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
  );
}

export default StackLayout;
