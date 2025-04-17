import { Stack } from "expo-router";

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="selectusertype" options={{ headerShown: false }}/>
            <Stack.Screen name="patientinfo" options={{ headerShown: false }}/>
            <Stack.Screen name="therapistinfo" options={{ headerShown: false }}/>
        </Stack>
    )
}

export default StackLayout;