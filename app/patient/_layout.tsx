import { Stack } from "expo-router";

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" options={{ headerShown: false }}/>
            <Stack.Screen name="progress" options={{ headerShown: false }}/>
            <Stack.Screen name="schedule" options={{ headerShown: false }}/>
            <Stack.Screen name="profile" options={{ headerShown: false }}/>
        </Stack>
    )
}

export default StackLayout;