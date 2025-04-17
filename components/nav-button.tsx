import { styles } from "@/constants/styles"
import whiteBox from '@/assets/images/white-box.png';
import { Href, router } from "expo-router"
import { Text, ImageBackground, Image, Pressable } from "react-native"

const NavigationButton = ({ 
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
                style={styles.navButtonBackground}
                source={whiteBox}
            >
                <Image
                    style={styles.navButtonLogo}
                    source={icon}
                />
                <Text style={styles.navButtonText}>{name}</Text>
            </ImageBackground>
        </Pressable>
    )
}

export default NavigationButton;