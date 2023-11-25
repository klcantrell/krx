import * as React from "react"
import { StyleSheet } from "react-native"

import { StyleGuide } from "app/components/animated"
import type { SharedValue } from "react-native-reanimated"
import { PanGestureHandler } from "react-native-gesture-handler"
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import Animated, {
  clamp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from "react-native-reanimated"
import { canvas2Polar, polar2Canvas } from "react-native-redash"

interface CursorProps {
  r: number
  strokeWidth: number
  theta: SharedValue<number>
  backgroundColor: SharedValue<string>
}

export const Cursor = ({ strokeWidth, theta, r, backgroundColor }: CursorProps) => {
  const center = { x: r, y: r }
  const style = {
    ...StyleSheet.absoluteFillObject,
    width: strokeWidth,
    backgroundColor: StyleGuide.palette.primary,
    height: strokeWidth,
    borderRadius: strokeWidth / 2,
    borderColor: "white",
    borderWidth: 5,
  }
  const animatedStyle = useAnimatedStyle(() => {
    const { x: translateX, y: translateY } = polar2Canvas({ theta: theta.value, radius: r }, center)
    return {
      backgroundColor: backgroundColor.value,
      transform: [{ translateX }, { translateY }],
    }
  })

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onStart: (_event, context) => {
      const { x, y } = polar2Canvas({ theta: theta.value, radius: r }, center)
      context.offsetX = x
      context.offsetY = y
    },
    onActive: (event, context) => {
      const { translationX, translationY } = event
      const x = context.offsetX + translationX
      const y = context.offsetY + translationY

      const yClamped = x < r ? y : theta.value < Math.PI ? clamp(y, 0, r - 0.001) : clamp(y, r, 2 * r)

      const angle = canvas2Polar({ x, y: yClamped }, center).theta

      // normalize the angle to go from 0 to 2PI
      theta.value = angle > 0 ? angle : angle + 2 * Math.PI
    },
  })

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[style, animatedStyle]} />
    </PanGestureHandler>
  )
}
