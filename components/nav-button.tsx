import React, {
  Text,
  ImageBackground,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity
} from "react-native"
import { Href, router } from "expo-router"
import whiteBox from '@/assets/images/white-box.png';

export const NavigationButton = ({ 
    isNavButton=true,
    name,
    icon,
    navTo,
  }: {
    isNavButton?: boolean,
    name: string,
    icon: any,
    navTo?: string | any,
  }) => {
  if (isNavButton) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(navTo as Href)}>
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
      </TouchableOpacity>
    )
  }
  else {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
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
      </TouchableOpacity>
    )
  }
}

const navButtonStyles = StyleSheet.create({
  navButtonLogo: {
    width: 65,
    height: 65,
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