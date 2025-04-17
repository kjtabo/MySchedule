import { Href, Redirect } from "expo-router";

let hasAuth = true;
// let userType = "therapist";
let userType = "patient";
let hrefLink = `/${userType}/home`

export default function Index() {
    if (hasAuth) {
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