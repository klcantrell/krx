import React from "react"
import { View, StyleSheet, Dimensions } from "react-native"

import type { Path } from "app/components//animated/AnimatedHelpers"
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated"
import type { DataPoint } from "./GraphScreen"
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler"

const { width } = Dimensions.get("window")

const CURSOR = 100

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  cursor: {
    backgroundColor: "white",
    borderColor: "#367be2",
    borderRadius: 15,
    borderWidth: 4,
    height: 30,
    width: 30,
  },
  cursorContainer: {
    alignItems: "center",
    height: CURSOR,
    justifyContent: "center",
    width: CURSOR,
  },
})

interface CursorProps {
  path: Path
  length: SharedValue<number>
  point: SharedValue<DataPoint>
}

export const Cursor = ({ path, length, point }: CursorProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_event, context) => {
      context.offsetX = interpolate(length.value, [0, path.length], [0, width], Extrapolate.CLAMP)
    },
    onActive: (event, context) => {
      length.value = interpolate(
        event.translationX + context.offsetX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP,
      )
    },
    onEnd: ({ velocityX }) => {
      length.value = withDecay({ velocity: velocityX, clamp: [0, path.length] })
    },
  })
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = point.value.coord.x - CURSOR / 2
    const translateY = point.value.coord.y - CURSOR / 2

    return {
      transform: [{ translateX }, { translateY }],
    }
  })

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.cursorContainer, animatedStyle]}>
          <View style={styles.cursor} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}
