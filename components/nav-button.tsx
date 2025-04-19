import whiteBox from '@/assets/images/white-box.png';
import { Href, router } from "expo-router"
import { Text, ImageBackground, Image, Pressable, StyleSheet } from "react-native"

export const NavigationButton = ({ 
        name,
        icon,
        navTo,
    }: {
        name: string,
        icon: any,
        navTo: string,
    }) => {
    return (
        <Pressable onPress={() => router.push(navTo as Href)}>
            <ImageBackground
                style={navButtonStyles.navButtonBackground}
                source={whiteBox}
            >
                <Image
                    style={navButtonStyles.navButtonLogo}
                    source={icon}
                />
                <Text style={navButtonStyles.navButtonText}>{name}</Text>
            </ImageBackground>
        </Pressable>
    )
}

const navButtonStyles = StyleSheet.create({
    navButtonLogo: {
        width: 65,
        height: 65,
        backgroundColor: "white",
    },
    navButtonBackground: {
        width: 105,
        height: 105,
        marginInline: 10,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    navButtonText: {
        fontWeight: "bold", 
        fontSize: 12,
        marginTop: -5,
    }
});