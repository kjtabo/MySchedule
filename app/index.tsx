import { Redirect } from "expo-router";

let hasAuth = true;
let userType = "patient";

export default function Index() {
    if (hasAuth) {
        return <Redirect href="/patient/home" />
    }
    else {
        return <Redirect href="/login" />
    }
    // return (
    //     <View className="flex-1 justify-center items-center">
    //         <Text className="text-5xl text-primary font-bold">Welcome to MySchedule!</Text>
    //         <Link href="/therapist/home" style={ styles.button }>Shit</Link>
    //         <Redirect href="/patient" />
    //     </View>
    // )
}