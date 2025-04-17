import { Href, Redirect } from "expo-router";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

// let userType = "therapist";
let userType = "patient";
let hrefLink = `/${userType}/home`

export default function Index() {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        return <Redirect href={hrefLink as Href}/>
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