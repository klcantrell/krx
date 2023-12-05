import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { isRTL } from "../i18n"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) {
  const insets = useSafeAreaInsets()

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <ScrollView
        contentContainerStyle={[$bottomContainerContent, { paddingBottom: insets.bottom * 2 }]}
        style={$bottomContainer}
      >
        <Button onPress={() => navigation.navigate("Transitions")}>Transitions</Button>
        <Button onPress={() => navigation.navigate("PanGesture")}>Pan Gesture</Button>
        <Button onPress={() => navigation.navigate("Animations")}>Animations</Button>
        <Button onPress={() => navigation.navigate("CircularSlider")}>Circular Slider</Button>
        <Button onPress={() => navigation.navigate("Graph")}>Graph</Button>
        <Button onPress={() => navigation.navigate("Swiping")}>Swiping</Button>
        <Button onPress={() => navigation.navigate("DynamicSpring")}>Dynamic Spring</Button>
        <Button onPress={() => navigation.navigate("DragToSort")}>Drag To Sort</Button>
        <Button onPress={() => navigation.navigate("Bezier")}>Bezier</Button>
        <Button onPress={() => navigation.navigate("ShapeMorphing")}>Shape Morphing</Button>
      </ScrollView>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  height: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
}
const $bottomContainerContent: ViewStyle = {
  justifyContent: "flex-start",
  gap: spacing.sm,
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}
