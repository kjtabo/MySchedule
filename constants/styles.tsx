import { StyleSheet } from "react-native";

let userType: string | undefined;

export function setUserType(type: string) {
  userType = type;
}

export function getUserType() {
  return userType;
}

export const gradientColor = ["#dbfff2", "#689dc4"] as const;

export const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    minHeight: "auto"
  },
  contentContainer: {
    flex: 0.85,
  },
  headerStyle: {
    fontSize: 32,
    marginTop: 30,
    alignSelf: "center",
    fontWeight: "bold"
  },
  navButtonContainer: {
    height: 15,
    alignSelf: "center",
    flexWrap: "wrap",
  },
});
