import React, { FC } from "react"
import { View, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"

import { Eye } from "./Eye"
import { Mouth } from "./Mouth"
import { SLIDER_WIDTH, Slider } from "./Slider"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"

interface ShapeMorphingScreenProps extends AppStackScreenProps<"ShapeMorphing"> {}

const bad = "#FDBEEB"
const normal = "#FDEEBE"
const good = "#BEFDE5"

const styles = StyleSheet.create({
  container: {
    backgroundColor: bad,
    flex: 1,
    justifyContent: "center",
  },
  eyes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  face: {
    alignItems: "center",
    alignSelf: "center",
    height: 150,
    justifyContent: "space-between",
    marginBottom: 32,
    width: 150,
  },
})

export const ShapeMorphingScreen: FC<ShapeMorphingScreenProps> = observer(
  function ShapeMorphingScreen() {
    const translateX = useSharedValue(0)
    const progress = useDerivedValue(() => translateX.value / SLIDER_WIDTH)
    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(progress.value, [0, 0.5, 1], [bad, normal, good]),
    }))

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.face}>
          <View style={styles.eyes}>
            <Eye progress={progress} />
            <Eye flip progress={progress} />
          </View>
          <Mouth progress={progress} />
        </View>
        <Slider translateX={translateX} />
      </Animated.View>
    )
  },
)
