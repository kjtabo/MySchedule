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
  headerContainer: {
    flex: 0.12,
    justifyContent: "flex-end",
    // backgroundColor: "blue"
  },
  homeContainer: {
    flex: 0.7
  },
  contentContainer: {
    flex: 0.7,
    overflow: "scroll"
  },
  headerStyle: {
    fontSize: 40,
    alignSelf: "center",
    fontWeight: "bold"
  },
  navButtonContainer: {
    flex: 0.18,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "blue"
  },
});
