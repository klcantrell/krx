import React from "react"
import { StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated"

import { StyleGuide } from "app/components/animated/StyleGuide"

const size = 32
const styles = StyleSheet.create({
  bubble: {
    backgroundColor: StyleGuide.palette.primary,
    borderRadius: size / 2,
    height: size,
    width: size,
  },
})

interface BubbleProps {
  progress: Animated.SharedValue<number>
  start: number
  end: number
}

export const Bubble = ({ progress, start, end }: BubbleProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [start, end], [0.5, 1], Extrapolate.CLAMP)
    const scale = interpolate(progress.value, [start, end], [1, 1.5], Extrapolate.CLAMP)
    return { opacity, transform: [{ scale }] }
  })
  return <Animated.View style={[styles.bubble, style]} />
}
