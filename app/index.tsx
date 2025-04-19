import { Href, Redirect } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export let userType: string | undefined;

export function setUserType(type: string) {
    userType = type;
}

export default function Index() {
    const user = FIREBASE_AUTH.currentUser;
    const db = FIREBASE_DB;

    const attemptSignIn = async () => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const userData = await getDoc(docRef);
            setUserType(userData.data()?.type);
            return <Redirect href={`/${userData.data()?.type}/home` as Href} />
        }
    }

    if (user) attemptSignIn();
    else return <Redirect href="/common/login" />
    // return (
    //     <View className="flex-1 justify-center items-center">
    //         <Text className="text-5xl text-primary font-bold">Welcome to MySchedule!</Text>
    //         <Link href="/therapist/home" style={ styles.button }>Shit</Link>
    //         <Redirect href="/patient" />
    //     </View>
    // )
}