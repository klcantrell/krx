/* eslint-disable react-native/no-color-literals */
import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

const { width } = Dimensions.get("window")
const CURSOR_SIZE = 40
const CONTAINER_WIDTH = width - 64
export const SLIDER_WIDTH = CONTAINER_WIDTH - CURSOR_SIZE
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: CONTAINER_WIDTH,
  },
  cursor: {
    alignItems: "center",
    borderColor: "white",
    borderRadius: CURSOR_SIZE * 0.3,
    borderWidth: 3,
    height: CURSOR_SIZE,
    justifyContent: "center",
    width: CURSOR_SIZE,
  },
  cursorPoint: {
    backgroundColor: "black",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  divider: {
    borderColor: "rgba(50, 50, 50, 0.5)",
    borderWidth: StyleSheet.hairlineWidth,
    width: SLIDER_WIDTH,
  },
  dividerContainer: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
})

interface SliderProps {
  translateX: SharedValue<number>
}

export const Slider = ({ translateX }: SliderProps) => {
  const offsetX = useSharedValue(0)
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = clamp(event.translationX + offsetX.value, 0, SLIDER_WIDTH)
    })
    .onEnd(() => {
      offsetX.value = translateX.value
    })
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.cursor, animatedStyle]}>
          <View style={styles.cursorPoint} />
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
