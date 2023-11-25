import React from "react"
import { Platform, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"

import { StyleGuide } from "app/components/animated"
import type { SharedValue } from "react-native-reanimated"
import Animated, { useAnimatedProps } from "react-native-reanimated"

const { PI } = Math

interface CircularProgressProps {
  theta: SharedValue<number>
  r: number
  strokeWidth: number
  backgroundColor: SharedValue<string>
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const CircularProgress = ({
  r,
  strokeWidth,
  theta,
  backgroundColor,
}: CircularProgressProps) => {
  const radius = r - strokeWidth / 2
  const circumference = radius * 2 * PI
  const props = useAnimatedProps(() => {
    return {
      strokeDashoffset: theta.value * radius,
      ...(Platform.OS === "ios" ? { stroke: backgroundColor.value } : null),
    }
  })

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <AnimatedCircle
        animatedProps={props}
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        stroke={StyleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        strokeWidth={strokeWidth}
      />
    </Svg>
  )
}
