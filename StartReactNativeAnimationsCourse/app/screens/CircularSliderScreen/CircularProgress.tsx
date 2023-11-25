import React from "react"
import { StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"

import type { SharedValue } from "react-native-reanimated"
import Animated, {
  createAnimatedPropAdapter,
  useAnimatedProps,
  processColor,
} from "react-native-reanimated"

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

  const adapter = createAnimatedPropAdapter(
    (props) => {
      if (Object.keys(props).includes("stroke")) {
        props.stroke = {
          type: 0,
          payload: processColor(props.stroke as string),
        }
      }
    },
    ["stroke"],
  )

  const props = useAnimatedProps(
    () => {
      return {
        strokeDashoffset: theta.value * radius,
        stroke: backgroundColor.value,
      }
    },
    [],
    adapter,
  )

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
        strokeDasharray={`${circumference}, ${circumference}`}
        strokeWidth={strokeWidth}
      />
    </Svg>
  )
}
