import React from "react"
import { StyleSheet } from "react-native"
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import Animated, {
  SharedValue,
  clamp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from "react-native-reanimated"

export const CONTROL_POINT_RADIUS = 20

interface ControlPointProps {
  x: SharedValue<number>
  y: SharedValue<number>
  min: number
  max: number
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    height: CONTROL_POINT_RADIUS * 2,
    position: "absolute",
    width: CONTROL_POINT_RADIUS * 2,
  },
})

export const ControlPoint = ({ x, y, min, max }: ControlPointProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_event, context) => {
      context.x = x.value
      context.y = y.value
    },
    onActive: (event, context) => {
      x.value = clamp(event.translationX + context.x, min, max)
      y.value = clamp(event.translationY + context.y, min, max)
    },
  })

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value - CONTROL_POINT_RADIUS },
      { translateY: y.value - CONTROL_POINT_RADIUS },
    ],
  }))

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.container, style]} />
    </PanGestureHandler>
  )
}
