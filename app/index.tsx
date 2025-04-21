import { Href, Redirect } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setUserType } from "@/constants/styles";
// import { setStatusBarHidden } from "expo-status-bar";

export default function Index() {
  const user = FIREBASE_AUTH.currentUser;
  const db = FIREBASE_DB;

  // setStatusBarHidden(true);

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
}