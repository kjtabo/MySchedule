import { StyleSheet } from "react-native";

export const gradientColor = ["#dbfff2", "#689dc4"] as const;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    headerStyle: {
        fontFamily: "Genty-Sans-Regular",
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 32,
        marginTop: 10
    },
    navButtonContainer: {
        marginBottom: 20,
        justifyContent: "center",
        flexDirection: "row",
    },
    navButtonLogo: {
        width: 70,
        height: 70,
        backgroundColor: "white",
    },
    navButtonBackground: {
        width: 105,
        height: 105,
        marginInline: 10,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    navButtonText: {
        fontWeight: "bold", 
        fontSize: 15,
        marginTop: -5,
    }
});
